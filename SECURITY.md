# 🛡️ Security Policy: CardioShield

At CardioShield, we are committed to maintaining a secure and private platform for clinical machine learning diagnostics. This security policy outlines supported versions, security best practices, data handling, and vulnerability reporting procedures.

---

## 📦 Supported Versions

Only the latest release versions of CardioShield receive active security patches and updates. We strongly encourage all users to run the latest code from the `main` branch.

| Version | Supported | Security Patches |
| :--- | :---: | :---: |
| **v1.0.x** (Current / Main) | 🟢 Yes | Active |
| **v0.9.x** (Beta / Jupyter Notebooks) | 🔴 No | None |
| **Experimental Branches** | 🔴 No | None |

---

## 🔒 Security Best Practices for Production

If you plan to deploy CardioShield in a production or live clinical environment, please follow these guidelines to prevent unauthorized exposure:

### 1. Enable Transport Security (HTTPS)
FastAPI does not enable HTTPS by default. In production, run the application behind a reverse proxy (such as **Nginx**, **Caddy**, or **Traefik**) configured with Let's Encrypt TLS certificates.

### 2. Restrict CORS (Cross-Origin Resource Sharing)
Ensure that backend middleware restricts API access to authorized domains. You can modify CORS settings in [main.py](file:///c:/Users/kanko/OneDrive/Desktop/VS%20Code/Test2/main.py):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-authorized-app.com"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)
```

### 3. Disable Interactive Documentation in Production
By default, FastAPI exposes Swagger UI at `/docs` and ReDoc at `/redoc`. In a production environment, disable these paths to prevent API exploration:
```python
app = FastAPI(
    title="Heart Disease Prediction API",
    docs_url=None,   # Disable Swagger UI
    redoc_url=None   # Disable ReDoc
)
```

---

## 🧬 Patient Data & Privacy Statement

*   **Zero External Tracking:** CardioShield does not transmit patient diagnostic parameters to third-party endpoints or external analysis cloud servers. All inference runs locally on the host server.
*   **In-Memory Processing:** The `/predict` endpoint processes patient data entirely in-memory. The application does not store diagnostic payloads in any persistent database unless you explicitly configure a database logger.

---

## 🐛 Reporting a Vulnerability

> [!WARNING]
> Please do **not** report security vulnerabilities via public GitHub Issues. 

If you discover a security vulnerability within CardioShield, please report it responsibly:

1.  **Email Us:** Contact the repository maintainer directly at the email listed on their GitHub profile.
2.  **Required Details:** Please include a detailed description of the vulnerability, a Proof of Concept (PoC) script, and steps to reproduce.
3.  **Vulnerability Triage:** We aim to acknowledge your report within **48 hours** and provide a validation status/fix schedule within **7 days**.
