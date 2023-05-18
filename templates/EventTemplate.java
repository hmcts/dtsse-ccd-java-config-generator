package {{ packageName }};

import org.springframework.stereotype.Component;
import uk.gov.hmcts.ccd.sdk.api.CCDConfig;
import uk.gov.hmcts.ccd.sdk.api.ConfigBuilder;
import {{ packageName }}.enums.State;
import {{ packageName }}.enums.UserRole;
import {{ packageName }}.model.CaseData;

{% for crud in crudImports  -%}
import static uk.gov.hmcts.ccd.sdk.api.Permission.{{ crud }};
{% endfor %}
{% for permission in permissions  -%}
import static {{ packageName }}.enums.UserRole.{{ permission["role"] }};
{% endfor %}

@Component
public class {{ className }} implements CCDConfig<CaseData, State, UserRole> {

    @Override
    public void configure(ConfigBuilder<CaseData, State, UserRole> builder) {

        builder.event("{{ event["ID"] }}")
            .forAllStates()
            .name("{{ event["Name"] }}")
            .description("{{ event["Description"] }}")
            {% for permission in permissions  -%}
            .grant({{ permission["CRUD"] }}, {{ permission["role"] -}})
            {% endfor -%}
            {% if event["ShowSummary"] !== "N" -%}
            .showSummary()
            {%- endif %}
            {%- if fields.length > 0  %}
            .fields()
            {%- for field in fields %}
            .{{ "optional" if field["DisplayContext"] == "OPTIONAL" else "mandatory" }}(CaseData::{{ field["fieldName"] }})
            {%- endfor %}{% endif %};
    }
}
