package uk.gov.hmcts.reform.fpl.enums;

import uk.gov.hmcts.ccd.sdk.api.CCD;

public enum State {

    @CCD(
      label = "Initial case state – create title as a minimum; add documents, etc."
    )
    Open,
    @CCD(
      label = "Submitted case state - LA can no longer edit")
    Submitted

}
