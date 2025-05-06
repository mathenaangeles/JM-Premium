import re
import os
import uuid
import unicodedata
import urllib.parse
from dotenv import load_dotenv
from google.cloud import storage
from werkzeug.datastructures import FileStorage

load_dotenv()

GCS_BUCKET_NAME = os.getenv('GCS_BUCKET_NAME')

def upload_image_to_gcs(file: FileStorage, folder: str = "products") -> str:
    storage_client = storage.Client()
    bucket = storage_client.bucket(GCS_BUCKET_NAME)
    sanitized_filename = generate_slug(file.filename)
    filename = f"{folder}/{sanitized_filename}_{uuid.uuid4().hex}"
    blob = bucket.blob(filename)
    blob.upload_from_file(file, content_type=file.content_type)
    blob.make_public()
    return blob.public_url

def delete_image_from_gcs(image_url: str):
    storage_client = storage.Client()
    bucket = storage_client.bucket(GCS_BUCKET_NAME)
    if "storage.googleapis.com" in image_url:
        object_name = "/".join(image_url.split("/")[4:])
        object_name = urllib.parse.unquote(object_name)
    else:
        object_name = image_url 
    blob = bucket.blob(object_name)
    blob.delete()

def generate_slug(text: str) -> str:
    text = text.lower()
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[\s]+', '-', text)
    text = re.sub(r'[^\w\-]', '', text)
    text = text.strip('-')
    text = re.sub(r'[\-]+', '-', text)
    return text

def generate_variant_name(product_name: str, option1_value: str = None, option2_value: str = None, option3_value: str = None) -> str:
    variant_name = [product_name]
    for option_value in [option1_value, option2_value, option3_value]:
        if option_value:
            variant_name.append(option_value)
    return " - ".join(variant_name) if len(variant_name) > 1 else product_name
