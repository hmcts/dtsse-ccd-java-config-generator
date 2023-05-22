package {{ packageName }};

import com.google.common.collect.ImmutableList;
import uk.gov.hmcts.ccd.sdk.api.HasRole;

import java.util.List;

public enum UserRole implements HasRole {

    {% for permission in allPermissions  -%}
    {{ permission["role"] -}}("{{ permission["UserRole"] }}"){{ ";" if loop.last else "," }}
    {% endfor -%}

    private final String role;
    private final String casetypePermissions;

    UserRole(String role) {
        this(role, "CRU");
    }

    UserRole(String role, String casetypePermissions) {
        this.role = role;
        this.casetypePermissions = casetypePermissions;
    }

    public String getRole() {
        return this.role;
    }

    @Override
    public String getCaseTypePermissions() {
        return casetypePermissions;
    }

    public List<String> getRoles() {
        return ImmutableList.of("caseworker", "caseworker-publiclaw", this.role);
    }
}
