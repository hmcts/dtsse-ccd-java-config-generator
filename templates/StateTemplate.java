package {{ packageName }};

import uk.gov.hmcts.ccd.sdk.api.CCD;

public enum State {
    {% for state in states %}
    @CCD(label = "{{ state["Name"] }}")
    {{ state["ID"] }}{{ ";" if loop.last else "," }}
    {% endfor %}
}
