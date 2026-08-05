# Secure Document Sharing Between Seller NP and Buyer NP

## Overview

Currently, documents (such as invoices) are shared using the `documents` construct, where the `url` points to the downloadable document.

This document outlines multiple approaches for securely sharing documents between Seller NP and Buyer NP.

---

# Approach 1: Password-Protected Document

In this approach, the document is password protected while the URL remains publicly accessible. The Buyer App downloads the document and prompts the user for the password.

### Example

```json
{
  "descriptor": {
    "code": "INVOICE",
    "name": "Invoice Document",
    "short_desc": "Download your Invoice document here.",
    "long_desc": "This document is password protected. To open it, enter your password in DDMMMYYYYXXXX format, where DDMMMYYYY represents your date of birth and XXXX represents the first four letters of your name."
  },
  "mime_type": "application/pdf",
  "url": "https://example-bpp.com/prod/seller/invoices/O1.pdf"
}
```

# Approach 2: Signed URL

In this approach, the Seller NP generates a signed URL that can only be validated by the Seller's server. The Buyer NP receives the signed URL and downloads the document using it.

### Example

```json
{
  "descriptor": {
    "code": "INVOICE",
    "name": "Invoice Document",
    "short_desc": "Download your Invoice document here.",
    "long_desc": "Download your Invoice document here."
  },
  "mime_type": "application/pdf",
  "url": "https://example-bpp.com/prod/seller/invoices/O1.pdf?token=<signed-token>"
}
```

<!-- ### Recommended JWT Algorithms

When JWT is used for generating signed URLs, the following algorithms are recommended:

| Algorithm | Recommendation | Remarks |
|------------|---------------|---------|
| **EdDSA (Ed25519)** | ⭐⭐⭐⭐⭐ Recommended | Modern, fast and secure. Recommended for new implementations. |
| **ES256 (ECDSA P-256)** | ⭐⭐⭐⭐ | Widely supported and secure. |
| **RS256 (RSA-256)** | ⭐⭐⭐⭐ | Commonly used when RSA infrastructure already exists. |
| **HS256** | ⭐⭐ | Suitable only when both parties securely share the same secret key. | -->

The signed token may contain claims such as:

- document id
- order id
- bap id
- created_at

---

# Approach 3: Password-Protected Document + Signed URL

This approach combines both mechanisms.

- The Buyer App first accesses the document using the signed URL.
- The downloaded document itself is password protected.

### Example

```json
{
  "descriptor": {
    "code": "INVOICE",
    "name": "Invoice Document",
    "short_desc": "Download your Invoice document here.",
    "long_desc": "This document is password protected. To open it, enter your password in DDMMMYYYYXXXX format, where DDMMMYYYY represents your date of birth and XXXX represents the first four letters of your name."
  },
  "mime_type": "application/pdf",
  "url": "https://example-bpp.com/prod/seller/invoices/O1.pdf?token=<signed-token>"
}
```
---
