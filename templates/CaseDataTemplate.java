package {{ packageName }};

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.hmcts.ccd.sdk.api.CCD;

@Data
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class CaseData {
    {% for field in fields %}
    @CCD(
      label = "{{ field["Label"] }}"
    )
    private String {{ field["ID"] }};
    {% endfor %}
}
