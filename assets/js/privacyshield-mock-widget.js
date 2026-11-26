
/*
 * TEMPORARY PrivacyShield mock widget
 * LOCAL UI TESTING ONLY.
 *
 * Imitates the interface used by the official guide:
 *   PrivacyShieldConsent.init()
 *   widget.getState()
 *
 * Does NOT connect to PrivacyShield or save consent.
 */

(function (window, document) {
  "use strict";

  window.PrivacyShieldConsent = {
    init: function (options) {
      options = options || {};

      var mount = document.querySelector(
        options.mountSelector || "#ps-consent"
      );

      if (!mount) {
        throw new Error(
          "PrivacyShield mock: mount element not found."
        );
      }

      var state = {
        noticeId: options.noticeId || null,
        selectedLanguageCode: "English",
        selectedPurposeIds: [],
        consentProvided: false,
        isReady: true
      };

      mount.innerHTML = "";

      var wrapper = document.createElement("div");

      wrapper.style.cssText =
        "border:1px solid #d8dee8;border-radius:8px;padding:16px;" +
        "font-family:Arial,sans-serif;color:#212741;background:#fff;";

      var heading = document.createElement("p");
      heading.textContent =
        "Privacy consent (LOCAL TEST ONLY)";
      heading.style.cssText =
        "font-weight:700;margin:0 0 8px;";

      var description = document.createElement("p");
      description.textContent =
        "Please select the purpose below and click Accept to test the form's consent validation.";

      description.style.cssText =
        "font-size:14px;line-height:1.5;margin:0 0 12px;";

      var label = document.createElement("label");

        label.style.cssText =
        "display:flex !important;" +
        "align-items:center !important;" +
        "justify-content:flex-start !important;" +
        "gap:10px !important;" +
        "width:100% !important;" +
        "margin:0 0 14px 0 !important;" +
        "padding:0 !important;" +
        "font-size:14px;";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.cssText = "margin-top:3px;";

      var labelText = document.createElement("span");
      labelText.textContent =
        "I agree to be contacted about my enquiry.";

      var accept = document.createElement("button");
      accept.type = "button";
      accept.textContent = "Accept";

      accept.style.cssText =
        "background:#43ba7f;color:#fff;border:0;" +
        "border-radius:5px;padding:9px 18px;" +
        "font-weight:600;cursor:pointer;";

      var status = document.createElement("span");

      status.setAttribute("aria-live", "polite");

      status.style.cssText =
        "font-size:13px;margin-left:10px;color:#287a50;";

      checkbox.addEventListener("change", function () {

        state.selectedPurposeIds = checkbox.checked
          ? ["contact-enquiry"]
          : [];

        state.consentProvided = false;
        status.textContent = "";

      });

      accept.addEventListener("click", function () {

        if (!checkbox.checked) {
          state.consentProvided = false;
          status.style.color = "#b42318";
          status.textContent =
            "Select the purpose before accepting.";
          return;
        }

        state.consentProvided = true;

        status.style.color = "#287a50";
        status.textContent =
          "Consent accepted for this local test.";

        window.dispatchEvent(
          new CustomEvent("privacyshield:confirmed", {
            detail: state
          })
        );

      });

      label.appendChild(checkbox);
      label.appendChild(labelText);

      wrapper.appendChild(heading);
      wrapper.appendChild(description);
      wrapper.appendChild(label);
      wrapper.appendChild(accept);
      wrapper.appendChild(status);

      mount.appendChild(wrapper);

      window.dispatchEvent(
        new CustomEvent("privacyshield:ready")
      );

      return {
        getState: function () {
          return {
            noticeId: state.noticeId,
            selectedLanguageCode:
              state.selectedLanguageCode,
            selectedPurposeIds:
              state.selectedPurposeIds.slice(),
            consentProvided: state.consentProvided,
            isReady: state.isReady
          };
        }
      };

    }
  };

})(window, document);
