package {{ packageName }};

import org.springframework.stereotype.Component;
import uk.gov.hmcts.ccd.sdk.api.CCDConfig;
import uk.gov.hmcts.ccd.sdk.api.ConfigBuilder;
import {{ packageName }}.enums.State;
import {{ packageName }}.enums.UserRole;
import {{ packageName }}.model.CaseData;

{% for permission in permissions  -%}
import static uk.gov.hmcts.ccd.sdk.api.Permission.{{ permission["CRUD"] }};
{% for role in permission["UserRoles"] -%}
import static {{ packageName }}.enums.UserRole.{{ role | upper }}
{% endfor %}
{%- endfor %}

@Component
public class {{ className }} implements CCDConfig<CaseData, State, UserRole> {

    @Override
    public void configure(ConfigBuilder<CaseData, State, UserRole> builder) {

        builder.event("{{ event["ID"] }}")
            .forAllStates()
            .name("{{ event["Name"] }}")
            .description("{{ event["Description"] }}")
            {% for permission in permissions  -%}
            .grant({{ permission["CRUD"] }}{% for role in permission["UserRoles"] -%}, {{ role | upper -}}{%- endfor %})
            {% endfor -%}
            {% if event["ShowSummary"] !== "N" -%}
            .showSummary()
            {%- endif %}
            .fields()
            .optional(CaseData::getFamilyManCaseNumber)
            .optional(CaseData::getCaseNotes);
    }
}
