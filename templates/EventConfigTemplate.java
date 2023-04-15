package {{ packageName }};

import org.springframework.stereotype.Component;
import uk.gov.hmcts.ccd.sdk.api.CCDConfig;
import uk.gov.hmcts.ccd.sdk.api.ConfigBuilder;
import uk.gov.hmcts.reform.fpl.enums.State;
import uk.gov.hmcts.reform.fpl.enums.UserRole;
import uk.gov.hmcts.reform.fpl.model.CaseData;

import static uk.gov.hmcts.ccd.sdk.api.Permission.CRU;
import static uk.gov.hmcts.reform.fpl.enums.UserRole.HMCTS_ADMIN;

@Component
public class {{ className }} implements CCDConfig<CaseData, State, UserRole> {

    @Override
    public void configure(ConfigBuilder<CaseData, State, UserRole> builder) {
        builder.event("{{ eventId }}")
            .forAllStates()
            .name("{{ eventName }}")
            .grant(CRU, HMCTS_ADMIN)
            .fields()
            .optional(CaseData::getFamilyManCaseNumber)
            .optional(CaseData::getCaseNotes);
    }
}
