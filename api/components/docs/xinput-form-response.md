# XInput

This XInput schema facilitates seamless communication between buyers and sellers by allowing the exchange of additional information through forms.
Sellers can request specific details using custom forms, and buyers respond with the necessary information, ensuring a smooth transaction process.
The differentiation in MIME types and additional settings, such as resubmit and multiple submissions, adds flexibility to the form interaction between participants.

## Seller-Side Form:

```
{
  "xinput": {
    "head": {
      "descriptor": {
        "name": "Form Name"
        "code": "FORM_ENUM_VALUE_1"
      },
     
      "headings": ["FORM_ENUM_VALUE_1", "FORM_ENUM_VALUE_2]
    },
    "form": {
      "id": "<Form_ID>",
      "mime_type": "<MIME_Type>",
      "url": "<Form_URL>",
      "multiple_sumbissions": <Multiple_Sumbissions_Flag>
    },
    "required": true
  }
}
```

- `head`: Contains basic details regarding the form such as form name, index.

  - `name`: Describes the form name.
  - `code`: Describes the form heading using a predefined enum format.
  - `headings`: Array containing all the form headings.

- `form`: Represents the form itself.

  - `id`: Unique ID associated with the form.
  - `mime_type`: Type of MIME.
  - `url`: Endpoint where the form is hosted.
  - `multiple_sumbissions`: Indicates whether multiple submissions are allowed.


 ### mime_type: 
 Describes the type of MIME.It can be one of the thee possible values: none or application/html. 
- **none***

When the `mime_type` is set to `none`, no form URL is provided and no external form needs to be rendered.

Instead, the Seller App requests the required additional information directly as part of the API payload. The format of form field names exchanged between both NPs should follow the **camelCase** naming convention.
 The Buyer App is responsible for collecting this information and including it in the subsequent ONDC API request. In this flow, the entire interaction is handled through standard API payload exchanges without the need for a hosted form.
 ```
  "form": {
    "id": "F01",
    "mime_type": "none",
    "data": {
      "name": {
        "type": "string"
      },
      "country": {
        "type": "string"
      },
      "countryCode": {
        "type": "string"
      }
  }
 ```




<!-- - **application/html**:

The buyer app redirects the user's browser to a seller app provided url. After completing the activity, seller app should take the responsibility to redirect the user's browser back to the buyer app so the user can continue his journey on the buyer application. We will follow the below conventions in handling these redirects.

  Seller app will redirect back the user to this url: `GET <bap_subscriber_url>/callback` with the following query params:
  1. `transaction_id` (transaction id used in the context)
  2. `status` - form status
  3. `form_id`
  4. `submission_id` (only in success case)

  Seller app will additionally send `on_status` call containing the form status and `submission_id` in `form_response`

  ```mermaid
  sequenceDiagram
      participant bap AS Buyer App
      participant bppf AS Form System
      participant bpp AS Seller App
      bap ->> bppf: redirect the user to form url
      alt submission successful
          bppf ->> bap: browser `/callback` with transaction id and status
          bpp ->> bap: `on_status` with `status`  and `submission_id`
      else submission failed
          bppf ->> bap: browser `/callback` with transaction id and failure status
          bpp ->> bap: `on_status` with `status` as `FAILED`
          bap ->> bppf: redirect the user again to the same form url
          bap ->> bppf: browser `/callback` with failure status (url can be used only once)
          bpp ->> bap: `on_status` with `status` as `FAILED`
      end
  ```


```shell
{
  "xinput": {
    "form_response": {
      "status": "<updated_status>",
      "submission_id": "<Submission_ID>"
    }
  }
}
```



   

## Form response

Possible ways to get the latest status after submitting a form

1. #### Form response for application/html
   To provide the buyer with latest form status, seller sends an unsolicated on_status call with Submission_ID. Additionally, if the seller doesn't sends an unsolicated call, the buyer can request the latest form status by sending a status call with the ref_id.

```shell
{
  "xinput": {
    "form_response": {
      "status": "<updated_status>",
      "submission_id": "<Submission_ID>"
    }
  }
}
```

- The seller responds with the latest status of submitted form corresponding to the submission_id ("Submission_ID") that was submitted earlier by the buyer. -->