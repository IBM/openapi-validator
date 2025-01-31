# Automated Quality Screening

The validator provides Automated Quality Screening (AQS) scores via the `-q` (or
`--impact-score`) flag. These scores help you evaluate risk and make decisions about investing in
the quality of your service's API. AQS scores are not a substitute for expert review, but minimum
AQS scores may be a prerequisite to a review.

AQS scores give you insight about four impact dimensions for API quality: usability, security,
robustness, and cost of evolution. Each dimension will be scored from 0 to 100, and the overall
score will be the average (mean) of the four individual scores.

In some cases, low scores will be a consequence of factors outside a service team's control, such
as maintaining compatibility with an existing system.

Conversely, high scores don't guarantee a high quality API, only that no significant quality
problems with the API _definition_ have been identified by the validator. It's important to know
that the most _consequential_ problems a service API can have are usually problems of design which
cannot be evaluated in an automated way.

AQS scores will be continuously recalibrated over time in order to make them as meaningful as
possible. Scores for a specific dimension of a specific API definition may go up or down as a result
of a recalibration. Recalibrations will occur as a part of minor (but not patch) releases of the
validator.

Findings (errors and warnings) produced by each rule of the validator will reduce the AQS score for
one or more impact dimensions. The size of the reduction is determined by the number of findings for
the rule and a qualitative weight assigned to the rule, scaled to the overall size of the API.

For each impact dimension, there is distinct criteria for assigning impact:

- **Usability** is the broadest category, as most problems with an API will manifest as (at least)
  usability problems. Anything from stylistic deviation from standards (for example `camelCase` vs.
  `snake_case`) to underspecified behavior has a usability impact.
- **Security** impact can come from clear deviations from best practices within an API design, but
  very often comes from undefined or excessively permissive validation constraints on values handled
  in an API. While some constraints may be enforced by a service implementation without being
  defined in its API definition, it must be assumed that they are not. Overly permissive constraints
  can indicate a susceptibility to code-injection or denial-of-service attacks.
- **Robustness** impact comes from undefined behavior that a client may rely on, API design likely
  to be misunderstood or misapplied, and missing robustness features such as optimistic locking that
  may be needed to mitigate race conditions for certain kinds of requests.
- **Evolution** impact comes from designing or specifying an API in such a way that it could be
  difficult, expensive, or impossible to provide backward compatibility when certain kinds of new
  features are added to a service.

Note that rules that identify undefined behavior often have an impact across all four impact
dimensions.

