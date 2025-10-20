"""
Lasso Grant Manager - Main Flask Application

A web application for managing and tagging agricultural grants.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

from config import TAGS, OPENAI_API_KEY
from models import Grant
from services.grant_tagger import GrantTagger
from storage import grant_storage
from utils import validate_grants_list, sanitize_grant_data

app = Flask(__name__)
CORS(app)

openai_client = None
if OPENAI_API_KEY:
    try:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        print("OpenAI client initialized successfully")
    except Exception as e:
        print(f"Failed to initialize OpenAI client: {e}")
        openai_client = None
else:
    print("No OpenAI API key provided, using keyword-based tagging only")

grant_tagger = GrantTagger(openai_client)

# API Routes

@app.route('/api/grants', methods=['POST'])
def add_grants():
    """Add new grants to the system and tag them."""
    try:
        data = request.get_json()
        
        validation_error = validate_grants_list(data)
        if validation_error:
            return jsonify({"error": validation_error}), 400
        
        processed_grants = []
        
        for grant_data in data:

            sanitized_data = sanitize_grant_data(grant_data)
            
            tags = grant_tagger.tag_grant(
                sanitized_data['grant_name'],
                sanitized_data['grant_description'],
                sanitized_data['website_urls'],
                sanitized_data['document_urls']
            )
            
            grant = Grant(
                grant_name=sanitized_data['grant_name'],
                grant_description=sanitized_data['grant_description'],
                website_urls=sanitized_data['website_urls'],
                document_urls=sanitized_data['document_urls'],
                tags=tags
            )
            
            added_grant = grant_storage.add_grant(grant)
            processed_grants.append(added_grant.to_dict())
        
        return jsonify({
            "message": f"Successfully processed {len(processed_grants)} grants",
            "grants": processed_grants
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error processing grants: {str(e)}"}), 500

@app.route('/api/grants', methods=['GET'])
def get_grants():
    """Get all grants with optional tag filtering."""
    try:
        tag_filter = request.args.get('tag')
        
        if tag_filter:
            grants = grant_storage.get_grants_by_tag(tag_filter)
        else:
            grants = grant_storage.get_all_grants()
        
        grants_data = [grant.to_dict() for grant in grants]
        
        return jsonify({"grants": grants_data}), 200
        
    except Exception as e:
        return jsonify({"error": f"Error retrieving grants: {str(e)}"}), 500

@app.route('/api/tags', methods=['GET'])
def get_tags():
    """Get all available tags."""
    try:
        used_tags = grant_storage.get_all_tags()
        
        return jsonify({
            "tags": TAGS,
            "used_tags": used_tags
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error retrieving tags: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000, use_reloader=False)