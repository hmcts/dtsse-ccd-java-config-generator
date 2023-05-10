package {{ packageName }};

import uk.gov.hmcts.ccd.sdk.api.CCD;

public enum State {

    @CCD(
      label = "Initial case state"
    )
    Open,
    @CCD(
      label = "Submitted case state")
    Submitted

}
