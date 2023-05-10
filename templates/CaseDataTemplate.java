package uk.gov.hmcts.reform.fpl.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.hmcts.ccd.sdk.api.CCD;

@Data
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class CaseData {

    @CCD(
      label = "Applicant name"
    )
    private String applicantName;

}
