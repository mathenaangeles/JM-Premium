from app import create_app

app = create_app()

@app.route('/')
def health():
    return {'status': 'OK', 'message': 'JM Premium server is running.'}, 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host="0.0.0.0", port=port)