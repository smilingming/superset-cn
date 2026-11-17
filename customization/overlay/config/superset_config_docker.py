# M3a pure i18n override.
# Scope: default Chinese locale only.
# Do not add branding, page shell, login page, asset, theme, or template changes here.

BABEL_DEFAULT_LOCALE = "zh"
BABEL_DEFAULT_FOLDER = "superset/translations"

LANGUAGES = {
    "zh": {"flag": "cn", "name": "Chinese"},
    "en": {"flag": "us", "name": "English"},
}

# BEGIN L1 BRANDING OVERLAY
# Logo/title/loading baseline. No direct changes to core/superset.
APP_NAME = "内蒙古移动交互式可视化经营分析平台"
APP_ICON = "/static/assets/images/custom/cmcc-navbar-logo.png"
FAVICONS = [{"href": "/static/assets/images/custom/cmcc-favicon.png"}]

THEME_DEFAULT = {
    "token": {
        "brandAppName": "内蒙古移动交互式可视化经营分析平台",
        "brandLogoUrl": "/static/assets/images/custom/cmcc-navbar-logo.png",
        "brandLogoAlt": "内蒙古移动",
        "brandLogoHref": "/superset/welcome/",
        "brandLogoHeight": "37px",
        "brandIconMaxWidth": 120,
        "brandSpinnerUrl": "/static/assets/images/custom/cmcc-loading.gif",
    }
}
# END L1 BRANDING OVERLAY

# BEGIN L1 UI DETAILS
# Production UI details. No direct changes to core/superset.

# Default Chinese only.
BABEL_DEFAULT_LOCALE = "zh"
LANGUAGES = {
    "zh": {"flag": "cn", "name": "中文"},
}

# About dialog.
SHOW_WATERMARK = False
VERSION_STRING = "1.0.0"
VERSION_SHA = ""

# Try to hide Google Sheets entry if current frontend reads these switches.
FEATURE_FLAGS = {
    **globals().get("FEATURE_FLAGS", {}),
    "ENABLE_GSHEETS": False,
    "ENABLE_GOOGLE_SHEETS": False,
}
# END L1 UI DETAILS

# BEGIN L1 EXAMPLES URI
# Explicit demo/examples database URI. Avoid port=None from docker dev defaults.
SQLALCHEMY_EXAMPLES_URI = "postgresql://examples:examples@db:5432/examples"
# END L1 EXAMPLES URI
