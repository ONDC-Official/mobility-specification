# ONDC Mobility Specification

These specifications are to enable ONDC Network Participants to expose or consume mobility services on ONDC.

ONDC mobility specification is an adaptation of [beckn mobility specifications](https://github.com/beckn/mobility).

These specifications will be released in multiple phases enabling different use case and enhancements.

ONDC mobility specification swagger [link](https://ondc-official.github.io/mobility-specification/)

## Latest Version

[v1.0.0](https://github.com/ONDC-Official/mobility-specification/releases/tag/v1.0.0)

## Earlier Versions

| Version | Release Date | beckn Version                      | Comments                                                                                                           |
| ------- | ------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| v1.0.0  | 14 Jun 2023  | core - 0.9.4<br />mobility - 0.8.2 | Initial mobility specification for metro use case                                                                  |
| v2.0.0  | 20 Feb 2024  | core - 1.2.0                       | Base version of mobility for metro is completed<br />Station code based flow<br />GPS based flow<br />Cancel flow |

## Introduction

Open Network for Digital Commerce (ONDC) is a network based on beckn open protocol and will enable local commerce across segments, such as mobility, retail etc, to be discovered and engaged by any network-enabled application.

ONDC mobility & travel aims to build a nationwide multi-modal network that provides seamless experiences, supports growth & innovation by,

* bringing together a diverse set of mobility, travel & transportation players who can engage with the open network on their own terms
* fostering collaboration, sharing & new models
* facilitating responsive policy by bringing onboard decision making authorities

In the mobility space, the intent is to enable seamless and truly multimodal transit options by bringing in diverse inventory onboard at scale that will serve the country’s population.

This would be possible in the mobility domain by making sure all mobility apps in the network are built in such a way as to enable them to communicate with each other in the same language.

## Enabled/Supported use cases on network

* Added TICKET_INFO tag group for ticket number
* Added ref_id in status call
* Added parent_stop_id for stops

## Evolution

The evolution of ONDC mobility specification driven by 2 factors:

1. The beckn mobility and/or core specification evolution.
2. ONDC Network Participants recommendation and requirement for enhancing and expanding the network use cases & experience.

To know more about how the specification evolves, visit the Network GOVERNANCE document.

To follow discussions related to the mobility specification please visit the [Discussions Forum](https://github.com/ONDC-Official/mobility-specification/discussions) on GitHub

Each major release of ONDC mobility specification will be approved by ONDC mobility working group members for which are listed [here](./Committee.md)

For minor releases for bug fix and cosmetic changes ONDC would make a minor release based on internal approval process and update the committee in the next scheduled discussion.

## Contribution

### Contribution to specifications

Anyone can contribute to the specification. Please refer beckn contribution guidelines.

### Contribution to network

Anyone can contribute to the network enhancements. Contributors must follow the contribution guidelines.

Each contribution will be peer-reviewed by the ONDC mobility committee members. If approved, this contribution will be merged with the applicable versions of the specification.

#### What is Contribution to network

Addition/Modification of examples, enum, policies which are very specific to the networks scope and purview.
