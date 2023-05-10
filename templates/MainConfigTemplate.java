package {{ packageName }};

import org.springframework.stereotype.Component;
import uk.gov.hmcts.ccd.sdk.api.CCDConfig;
import uk.gov.hmcts.ccd.sdk.api.ConfigBuilder;
import {{ packageName }}.enums.State;
import {{ packageName }}.enums.UserRole;
import {{ packageName }}.model.CaseData;

@Component
public class {{ className }} implements CCDConfig<CaseData, State, UserRole> {

    @Override
    public void configure(ConfigBuilder<CaseData, State, UserRole> builder) {

        builder.jurisdiction("{{ jurisdiction["ID"] }}", "{{ jurisdiction["Name"] }}", "{{ jurisdiction["Description"] }}");
        {% for caseType in caseTypes -%}
        builder.caseType("{{ caseType["ID"] }}", "{{ caseType["Name"] }}", "{{ caseType["Description"] }}");
        {%- endfor %}
        {% if jurisdiction["Shuttered"] == "Yes" -%}
        builder.shutterService();
        {%- endif %}
    }
}
