from flask import Flask, request, Response
import subprocess

app = Flask(__name__)

@app.route('/scrape', methods=['POST'])
def scrape():
    category = request.json.get('category')

    def generate():
        process = subprocess.Popen(
            ['python3', '-u', 'main.py', category],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        for line in process.stdout:
            yield line
        process.wait()

    return Response(generate(), mimetype='text/plain')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)