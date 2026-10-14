"""
Alfiya Patil Portfolio - Python Flask Backend Application
Serves static portfolio assets and handles client contact inquiries.
"""

import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from flask import Flask, send_from_directory, request, jsonify, render_template_string

app = Flask(__name__, static_folder='.', static_url_path='')

INQUIRIES_FILE = os.path.join(os.path.dirname(__file__), 'inquiries.json')
GMAIL_RECEIVER = 'patilalfiya1@gmail.com'


@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


def send_direct_email(record):
    """
    Optionally dispatch real email via Gmail SMTP if GMAIL_APP_PASSWORD is set.
    """
    app_password = os.environ.get('GMAIL_APP_PASSWORD', '').strip()
    sender_email = os.environ.get('GMAIL_USER', GMAIL_RECEIVER).strip()
    
    if not app_password:
        return {'sent': False, 'reason': 'GMAIL_APP_PASSWORD not configured'}
        
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"🚀 New Project Inquiry from {record['name']} - {record.get('service', 'Portfolio')}"
        msg['From'] = f"Alfiya Portfolio <{sender_email}>"
        msg['To'] = GMAIL_RECEIVER
        msg['Reply-To'] = record['email']
        
        text_content = f"""
New Inquiry Received from Portfolio:

Name: {record['name']}
Email: {record['email']}
Service: {record.get('service', 'N/A')}
Timeline: {record.get('timeline', 'N/A')}
Submitted: {record['timestamp']}

Message:
{record['message']}
        """
        
        html_content = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px;">
                <h2 style="color: #4338ca; margin: 0 0 4px 0;">🎉 New Portfolio Project Inquiry</h2>
                <span style="font-size: 13px; color: #64748b;">Received at {record['timestamp']}</span>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 110px;">Client Name:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">{record['name']}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Client Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:{record['email']}" style="color: #6366f1; text-decoration: none; font-weight: 600;">{record['email']}</a></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Service Needed:</td>
                    <td style="padding: 8px 0; color: #0f172a;">{record.get('service', 'N/A')}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Timeline:</td>
                    <td style="padding: 8px 0; color: #0f172a;">{record.get('timeline', 'N/A')}</td>
                </tr>
            </table>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <strong style="color: #334155; display: block; margin-bottom: 8px;">Project Details / Message:</strong>
                <p style="margin: 0; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">{record['message']}</p>
            </div>
            
            <div style="text-align: center; margin-top: 24px;">
                <a href="mailto:{record['email']}?subject=Re:%20Your%20Inquiry%20for%20{record.get('service', 'Project')}" 
                   style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">
                   Reply directly to {record['name']} &rarr;
                </a>
            </div>
        </div>
        """
        
        msg.attach(MIMEText(text_content, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))
        
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=10) as server:
            server.login(sender_email, app_password)
            server.sendmail(sender_email, [GMAIL_RECEIVER], msg.as_string())
            
        print(f">> [EMAIL SENT] Direct SMTP email delivered to {GMAIL_RECEIVER} from {record['name']}")
        return {'sent': True, 'receiver': GMAIL_RECEIVER}
    except Exception as exc:
        print(f">> [EMAIL ERROR] SMTP dispatch failed: {exc}")
        return {'sent': False, 'error': str(exc)}


@app.route('/')
def index():
    """Serve the main portfolio landing page."""
    return send_from_directory('.', 'index.html')


@app.route('/api/inquiries', methods=['GET'])
def get_inquiries():
    """Retrieve all received inquiries stored in inquiries.json."""
    inquiries = []
    if os.path.exists(INQUIRIES_FILE):
        try:
            with open(INQUIRIES_FILE, 'r', encoding='utf-8') as f:
                inquiries = json.load(f)
        except Exception:
            inquiries = []
    inquiries.reverse()
    return jsonify({
        'status': 'success',
        'count': len(inquiries),
        'inquiries': inquiries
    })


@app.route('/inquiries')
def inquiries_dashboard():
    """A sleek visual inbox dashboard to view all received client messages."""
    inquiries = []
    if os.path.exists(INQUIRIES_FILE):
        try:
            with open(INQUIRIES_FILE, 'r', encoding='utf-8') as f:
                inquiries = json.load(f)
        except Exception:
            inquiries = []
    inquiries.reverse()

    dashboard_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inquiries Inbox | Alfiya Patil Portfolio</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #6366f1;
          --primary-dark: #4338ca;
          --bg: #f8fafc;
          --card: #ffffff;
          --border: #e2e8f0;
          --text: #0f172a;
          --text-muted: #64748b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(135deg, #f5f3ff 0%, #f0fdf4 50%, #eff6ff 100%);
          color: var(--text);
          min-height: 100vh;
          padding: 2.5rem 1.25rem;
        }
        .container { max-width: 960px; margin: 0 auto; }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          padding: 1.5rem 2rem;
          border-radius: 20px;
          border: 1px solid var(--border);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.08);
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .header-title-box { display: flex; align-items: center; gap: 1rem; }
        .header-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        h1 { font-size: 1.5rem; font-weight: 800; color: var(--text); }
        .subtitle { font-size: 0.88rem; color: var(--text-muted); }
        .header-actions { display: flex; gap: 0.75rem; align-items: center; }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35); }
        .btn-outline {
          background: #ffffff;
          border-color: var(--border);
          color: var(--text);
        }
        .btn-outline:hover { background: #f1f5f9; }
        .badge-count {
          background: #e0e7ff;
          color: #4338ca;
          font-weight: 700;
          font-size: 0.82rem;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
        }
        .inquiry-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 1.6rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
          transition: all 0.25s ease;
        }
        .inquiry-card:hover {
          border-color: #c7d2fe;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -6px rgba(99, 102, 241, 0.12);
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .client-name { font-size: 1.15rem; font-weight: 700; color: #0f172a; }
        .client-email {
          color: #6366f1;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
        }
        .client-email:hover { text-decoration: underline; }
        .time-badge {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
          background: #f1f5f9;
          padding: 0.3rem 0.65rem;
          border-radius: 8px;
        }
        .tag-pill {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          background: #fdf2f8;
          color: #db2777;
          margin-right: 0.5rem;
        }
        .message-box {
          background: #f8fafc;
          border-left: 4px solid #6366f1;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          font-size: 0.94rem;
          line-height: 1.6;
          color: #334155;
          white-space: pre-wrap;
          margin: 1rem 0;
        }
        .card-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-top: 0.85rem;
        }
        .empty-state {
          text-align: center;
          background: #ffffff;
          padding: 4rem 2rem;
          border-radius: 20px;
          border: 1px dashed var(--border);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-title-box">
            <div class="header-icon">📬</div>
            <div>
              <h1>Client Inquiries Inbox</h1>
              <div class="subtitle">Direct records received at patilalfiya1@gmail.com &amp; local server</div>
            </div>
          </div>
          <div class="header-actions">
            <span class="badge-count">{{ count }} messages</span>
            <a href="/" class="btn btn-outline">&larr; Back to Portfolio</a>
            <button onclick="location.reload()" class="btn btn-primary">&#x21bb; Refresh</button>
          </div>
        </div>

        {% if inquiries %}
          {% for item in inquiries %}
            <div class="inquiry-card">
              <div class="card-top">
                <div>
                  <div class="client-name">{{ item.name }}</div>
                  <a href="mailto:{{ item.email }}" class="client-email">&#x2709; {{ item.email }}</a>
                </div>
                <div class="time-badge">{{ item.timestamp }}</div>
              </div>
              <div>
                <span class="tag-pill">{{ item.service or 'Responsive Website' }}</span>
                {% if item.timeline %}
                  <span class="tag-pill" style="background: #ecfdf5; color: #059669;">⏱ {{ item.timeline }}</span>
                {% endif %}
              </div>
              <div class="message-box">{{ item.message }}</div>
              <div class="card-actions">
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to={{ item.email }}&su=Re:%20Inquiry%20regarding%20{{ item.service }}&body=Hi%20{{ item.name }},%0A%0AThank%20you%20for%20reaching%20out%20regarding%20your%20project!" 
                   target="_blank" class="btn btn-primary" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                  &#x1F680; Reply in Gmail
                </a>
                <a href="mailto:{{ item.email }}" class="btn btn-outline" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                  &#x2709; Default Email App
                </a>
              </div>
            </div>
          {% endfor %}
        {% else %}
          <div class="empty-state">
            <h2 style="margin-bottom: 0.5rem; color: #475569;">No Inquiries Yet</h2>
            <p style="color: #94a3b8; margin-bottom: 1.5rem;">Submitted inquiries will appear here automatically.</p>
            <a href="/" class="btn btn-primary">Go to Portfolio</a>
          </div>
        {% endif %}
      </div>
    </body>
    </html>
    """
    return render_template_string(dashboard_html, inquiries=inquiries, count=len(inquiries))


@app.route('/api/contact', methods=['POST'])
def contact_api():
    """
    Handle client project inquiries submitted from the contact form.
    Stores inquiries in a local inquiries.json file and optionally sends email.
    """
    try:
        data = request.get_json(silent=True) or request.form.to_dict()
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        service = data.get('service', 'General Inquiry').strip()
        timeline = data.get('timeline', 'Flexible').strip()
        message = data.get('message', '').strip()
        
        if not name or not email or not message:
            return jsonify({
                'status': 'error',
                'message': 'Name, email, and message are required fields.'
            }), 400
            
        inquiry_record = {
            'timestamp': datetime.utcnow().isoformat(),
            'name': name,
            'email': email,
            'service': service,
            'timeline': timeline,
            'message': message,
            'client_ip': request.remote_addr
        }
        
        # Append to inquiries.json
        inquiries = []
        if os.path.exists(INQUIRIES_FILE):
            try:
                with open(INQUIRIES_FILE, 'r', encoding='utf-8') as f:
                    inquiries = json.load(f)
            except Exception:
                inquiries = []
                
        inquiries.append(inquiry_record)
        
        with open(INQUIRIES_FILE, 'w', encoding='utf-8') as f:
            json.dump(inquiries, f, indent=2, ensure_ascii=False)
            
        # Attempt direct Gmail SMTP dispatch if configured
        smtp_result = send_direct_email(inquiry_record)
        
        return jsonify({
            'status': 'success',
            'message': 'Thank you! Your project inquiry has been saved and processed.',
            'email_sent': smtp_result.get('sent', False),
            'target_email': GMAIL_RECEIVER,
            'received': {
                'name': name,
                'email': email,
                'service': service,
                'timeline': timeline
            }
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Server error processing inquiry: {str(e)}'
        }), 500


if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    port = int(os.environ.get('PORT', 5050))
    print(f">> Alfiya Patil Portfolio Server running at http://127.0.0.1:{port}")
    print(f">> Inquiries Inbox available at http://127.0.0.1:{port}/inquiries")
    app.run(host='0.0.0.0', port=port, debug=False)
