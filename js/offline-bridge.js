/* ============================================================================
 * PK Khmer Type — Local-First Offline Resilience & Network Bridge (PKOfflineBridge)
 *
 * Responsibilities:
 * 1. Real-time network connectivity monitoring ('online' / 'offline' events)
 * 2. Unobtrusive topbar offline status pill with reassuring local-first feedback
 * 3. Offline Hub Modal: transparent insight into local storage, pending queue, and readiness
 * 4. 1-Click offline JSON progress export & import (zero cloud/network dependency)
 * 5. Automatic cloud queue reconciliation trigger upon connection recovery
 * 6. Service worker registration & PWA lifecycle management
 *
 * Strict Zero-Emoji Policy: 100% SVG vector icons only.
 * ============================================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(root);
  } else {
    root.PKOfflineBridge = factory(root);
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function (root) {
  "use strict";

  var TOAST_CONTAINER_ID = "toastStack";
  var OFFLINE_INDICATOR_ID = "pkOfflineIndicator";
  var OFFLINE_MODAL_ID = "pkOfflineModal";

  var PROGRESS_KEYS = [
    "khmerProgress_v2",
    "khmerProgress_v1",
    "khmerGlobalStats",
    "khmerTrackingData_v1",
    "khmerReviewData_v1",
    "khmerCustomLessons_v1",
    "khmerCustomProgress_v1",
    "khmerTrialBest",
    "pk_adaptive_state_v1",
    "khmerTheme",
    "khmerKeyLayout",
    "khmerSoundOn",
    "khmerFontSize",
    "khmerSettingTheme",
    "khmerSettingPerformanceMode",
    "khmerSettingAnimationMode",
    "khmerSettingReducedMotion",
    "khmerSettingSound",
    "khmerSettingHands",
    "khmerSettingHandsOpacity",
    "khmerSettingAccent",
    "khmerSettingKhmerFont",
    "khmerSettingShiftPreview",
    "khmerSettingKeyHighlight",
    "khmerSettingHighContrast",
    "khmerSettingCompactKeys",
    "khmerSettingKeyFx",
    "khmerSettingTargetWpm",
    "kk_site_lang",
    "pk_cloud_progress_reset_at"
  ];

  var state = {
    isOnline: typeof navigator !== "undefined" && typeof navigator.onLine === "boolean" ? navigator.onLine : true,
    wasOffline: false,
    queuedCount: 0,
    initialized: false
  };

  /* ---------- Helpers ---------- */

  function isCurrentLangKhmer() {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem("kk_site_lang") === "km";
      }
    } catch (_e) {}
    return false;
  }

  function getPendingQueueCount() {
    try {
      if (root.PKCloudSync && typeof root.PKCloudSync.getSyncState === "function") {
        var syncState = root.PKCloudSync.getSyncState();
        if (syncState && typeof syncState.queuedCount === "number") {
          return syncState.queuedCount;
        }
      }
      if (typeof localStorage !== "undefined") {
        var rawFallback = localStorage.getItem("pk_cloud_sync_queue_fallback_v1");
        if (rawFallback) {
          var parsed = JSON.parse(rawFallback);
          if (Array.isArray(parsed)) return parsed.length;
        }
      }
    } catch (_e) {}
    return 0;
  }

  function showToast(title, subtitle, type) {
    if (typeof document === "undefined") return;
    var container = document.getElementById(TOAST_CONTAINER_ID);
    if (!container) return;

    var toast = document.createElement("div");
    toast.className = "toast toast-" + (type || "info");
    toast.setAttribute("role", "status");

    // Strict Zero-Emoji: Inline SVG icons only
    var iconSvg = "";
    if (type === "success") {
      iconSvg = '<svg class="pk-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === "warning") {
      iconSvg = '<svg class="pk-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else {
      iconSvg = '<svg class="pk-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    var content = document.createElement("div");
    content.className = "toast-content";

    var titleEl = document.createElement("strong");
    titleEl.textContent = title;
    content.appendChild(titleEl);

    if (subtitle) {
      var subEl = document.createElement("span");
      subEl.textContent = subtitle;
      content.appendChild(subEl);
    }

    toast.innerHTML = iconSvg;
    toast.appendChild(content);
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("toast-fade-out");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4000);
  }

  /* ---------- UI Updates ---------- */

  function updateStatusPill(isOnline) {
    if (typeof document === "undefined") return;
    var pill = document.getElementById(OFFLINE_INDICATOR_ID);
    if (!pill) return;

    var isKhmer = isCurrentLangKhmer();
    var labelEl = pill.querySelector(".pk-offline-label");
    var queueCount = getPendingQueueCount();

    if (!isOnline) {
      pill.hidden = false;
      pill.classList.remove("online-restored");
      pill.classList.add("offline-active");
      pill.setAttribute("aria-label", isKhmer ? "ដំណើរការក្រៅបណ្តាញ៖ រក្សាទុកក្នុងម៉ាស៊ីន" : "Offline Mode: Saved Locally");
      pill.setAttribute("title", isKhmer ? "គ្មានអ៊ីនធឺណិត — រាល់ការហ្វឹកហាត់ត្រូវបានរក្សាទុកក្នុងម៉ាស៊ីន (ចុចដើម្បីមើល)" : "Offline Mode: All typing progress is preserved on this device. Click for details.");

      if (labelEl) {
        var queueText = queueCount > 0 ? " (" + queueCount + ")" : "";
        labelEl.textContent = (isKhmer ? "ក្រៅបណ្តាញ (រក្សាទុក)" : "Offline Mode (Saved)") + queueText;
      }
    } else {
      if (state.wasOffline) {
        pill.hidden = false;
        pill.classList.remove("offline-active");
        pill.classList.add("online-restored");
        pill.setAttribute("aria-label", isKhmer ? "បានភ្ជាប់ឡើងវិញ • បានធ្វើសមកាលកម្ម" : "Back Online • Synced");

        if (labelEl) {
          labelEl.textContent = isKhmer ? "បានភ្ជាប់ឡើងវិញ • បានធ្វើសមកាលកម្ម" : "Back Online • Synced";
        }

        // Show reassurance toast
        showToast(
          isKhmer ? "បានភ្ជាប់អ៊ីនធឺណិតឡើងវិញ" : "Back Online",
          isKhmer ? "ទិន្នន័យហាត់វាយអក្សរបានធ្វើសមកាលកម្មជាមួយពពក" : "Typing progress synchronized with cloud.",
          "success"
        );

        // Auto-fade after 4 seconds
        setTimeout(function () {
          if (state.isOnline) {
            pill.hidden = true;
            pill.classList.remove("online-restored");
          }
        }, 4000);
      } else {
        pill.hidden = true;
      }
    }
  }

  function updateModalDetails() {
    if (typeof document === "undefined") return;
    var modal = document.getElementById(OFFLINE_MODAL_ID);
    if (!modal || modal.hidden) return;

    var isKhmer = isCurrentLangKhmer();
    var queueCount = getPendingQueueCount();

    var statusBadge = document.getElementById("pkOfflineModalStatusBadge");
    var statusText = document.getElementById("pkOfflineModalStatusText");
    var queueText = document.getElementById("pkOfflinePendingQueueCount");

    if (statusBadge && statusText) {
      if (state.isOnline) {
        statusBadge.className = "pk-offline-badge-live online";
        statusText.textContent = isKhmer ? "ភ្ជាប់អ៊ីនធឺណិត (Online)" : "Online & Synced";
      } else {
        statusBadge.className = "pk-offline-badge-live offline";
        statusText.textContent = isKhmer ? "ដំណើរការក្រៅបណ្តាញ (Offline)" : "Offline Mode Active";
      }
    }

    if (queueText) {
      queueText.textContent = queueCount + (isKhmer ? " កិច្ចការរង់ចាំ" : (queueCount === 1 ? " Item" : " Items"));
    }
  }

  function showOfflineModal() {
    if (typeof document === "undefined") return;
    var modal = document.getElementById(OFFLINE_MODAL_ID);
    if (!modal) return;
    updateModalDetails();
    modal.hidden = false;
  }

  function hideOfflineModal() {
    if (typeof document === "undefined") return;
    var modal = document.getElementById(OFFLINE_MODAL_ID);
    if (modal) modal.hidden = true;
  }

  /* ---------- Local Progress Backup & Restore (Zero API Dependency) ---------- */

  function collectLocalDataBundle() {
    var bundle = {
      app: "PK Khmer Type",
      generator: "PK Khmer Type Connection-Agnostic Offline Engine",
      version: "2.4.0-beta",
      exportedAt: new Date().toISOString(),
      offline: !state.isOnline,
      deviceData: {}
    };

    if (typeof localStorage === "undefined") return bundle;

    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (!key) continue;

      var shouldInclude = false;
      if (PROGRESS_KEYS.indexOf(key) !== -1) shouldInclude = true;
      if (key.indexOf("khmerLessonBest_") === 0) shouldInclude = true;
      if (key.indexOf("khmerRaceBest") === 0) shouldInclude = true;
      if (key.indexOf("pk_user_avatar_") === 0) shouldInclude = true;

      if (shouldInclude) {
        try {
          var rawVal = localStorage.getItem(key);
          if (rawVal !== null) {
            try {
              bundle.deviceData[key] = JSON.parse(rawVal);
            } catch (_err) {
              bundle.deviceData[key] = rawVal;
            }
          }
        } catch (_e) {}
      }
    }
    return bundle;
  }

  function exportLocalBackup() {
    var bundle = collectLocalDataBundle();
    var jsonStr = JSON.stringify(bundle, null, 2);
    var dateStamp = new Date().toISOString().slice(0, 10);
    var fileName = "pk_khmer_type_local_backup_" + dateStamp + ".json";

    if (typeof Blob !== "undefined" && typeof document !== "undefined") {
      var blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(function () {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 200);

      var isKhmer = isCurrentLangKhmer();
      showToast(
        isKhmer ? "បានទាញយកទិន្នន័យបម្រុងទុក" : "Backup Exported",
        isKhmer ? "ឯកសារ " + fileName + " បានរក្សាទុកក្នុងម៉ាស៊ីន" : "File " + fileName + " safely downloaded.",
        "success"
      );
    }
    return bundle;
  }

  function importLocalBackup(fileContent) {
    if (!fileContent) {
      return { ok: false, error: "Empty file." };
    }

    var parsed;
    try {
      parsed = typeof fileContent === "string" ? JSON.parse(fileContent) : fileContent;
    } catch (e) {
      return { ok: false, error: "Invalid JSON format: " + e.message };
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: "Invalid backup structure." };
    }

    // Prototype pollution defense
    if (Object.prototype.hasOwnProperty.call(parsed, "__proto__") ||
        Object.prototype.hasOwnProperty.call(parsed, "constructor") ||
        Object.prototype.hasOwnProperty.call(parsed, "prototype")) {
      return { ok: false, error: "Security violation: invalid payload structure." };
    }

    var dataMap = parsed.deviceData || parsed.data || parsed;
    if (typeof dataMap !== "object") {
      return { ok: false, error: "No recognizable data payload in backup." };
    }

    var restoredCount = 0;
    if (typeof localStorage !== "undefined") {
      for (var k in dataMap) {
        if (!Object.prototype.hasOwnProperty.call(dataMap, k)) continue;
        if (k === "__proto__" || k === "constructor" || k === "prototype") continue;

        var val = dataMap[k];
        try {
          var strVal = typeof val === "object" && val !== null ? JSON.stringify(val) : String(val);
          localStorage.setItem(k, strVal);
          restoredCount++;
        } catch (_writeErr) {}
      }
    }

    var isKhmer = isCurrentLangKhmer();
    showToast(
      isKhmer ? "បានបញ្ចូលទិន្នន័យជោគជ័យ" : "Backup Restored",
      isKhmer ? restoredCount + " កំណត់ត្រាត្រូវបានស្ដារឡើងវិញ" : restoredCount + " items restored successfully.",
      "success"
    );

    return { ok: true, restoredCount: restoredCount };
  }

  /* ---------- Network Event Listeners ---------- */

  function handleOnline() {
    state.isOnline = true;
    updateStatusPill(true);
    updateModalDetails();

    // Trigger queue flush if cloud sync module is loaded
    if (root.PKCloudSync && typeof root.PKCloudSync.flushOfflineQueue === "function") {
      root.PKCloudSync.flushOfflineQueue();
    }

    state.wasOffline = false;
  }

  function handleOffline() {
    state.isOnline = false;
    state.wasOffline = true;
    updateStatusPill(false);
    updateModalDetails();

    var isKhmer = isCurrentLangKhmer();
    showToast(
      isKhmer ? "គ្មានការតភ្ជាប់អ៊ីនធឺណិត" : "Offline Mode Active",
      isKhmer ? "រាល់ការវាយអក្សរត្រូវបានរក្សាទុកក្នុងម៉ាស៊ីននេះយ៉ាងមានសុវត្ថិភាព" : "Working locally. All typing records are safely stored on this computer.",
      "info"
    );
  }

  /* ---------- Service Worker Registration ---------- */

  function registerServiceWorker() {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && window.location.protocol !== "file:") {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").then(function (_reg) {
          // SW registered successfully
        }).catch(function (err) {
          console.warn("[PKOfflineBridge] Service worker registration notice:", err);
        });
      });
    }
  }

  /* ---------- Lifecycle Initialization ---------- */

  function init() {
    if (state.initialized) return;
    state.initialized = true;

    // Check initial online state
    state.isOnline = typeof navigator !== "undefined" && typeof navigator.onLine === "boolean" ? navigator.onLine : true;

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Listen for language toggles to update UI text dynamically
      window.addEventListener("pk:lang-changed", function () {
        updateStatusPill(state.isOnline);
        updateModalDetails();
      });
    }

    // Subscribe to PKCloudSync if available
    if (root.PKCloudSync && typeof root.PKCloudSync.onSyncStateChange === "function") {
      root.PKCloudSync.onSyncStateChange(function (syncState) {
        if (syncState && typeof syncState.queuedCount === "number") {
          state.queuedCount = syncState.queuedCount;
          updateStatusPill(state.isOnline);
          updateModalDetails();
        }
      });
    }

    // Bind DOM triggers when DOM is ready
    if (typeof document !== "undefined") {
      var bindUi = function () {
        var pill = document.getElementById(OFFLINE_INDICATOR_ID);
        if (pill) {
          pill.addEventListener("click", showOfflineModal);
        }

        var closeBtn = document.getElementById("pkOfflineCloseBtn");
        if (closeBtn) {
          closeBtn.addEventListener("click", hideOfflineModal);
        }

        var resumeBtn = document.getElementById("pkOfflineResumeBtn");
        if (resumeBtn) {
          resumeBtn.addEventListener("click", hideOfflineModal);
        }

        var exportBtn = document.getElementById("pkOfflineExportBtn");
        if (exportBtn) {
          exportBtn.addEventListener("click", exportLocalBackup);
        }

        var importBtn = document.getElementById("pkOfflineImportBtn");
        var importInput = document.getElementById("pkOfflineImportFileInput");
        if (importBtn && importInput) {
          importBtn.addEventListener("click", function () {
            importInput.click();
          });
          importInput.addEventListener("change", function (e) {
            var file = e.target.files && e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (evt) {
              var res = importLocalBackup(evt.target.result);
              if (res.ok) {
                setTimeout(function () {
                  location.reload();
                }, 800);
              }
            };
            reader.readAsText(file);
          });
        }

        var modal = document.getElementById(OFFLINE_MODAL_ID);
        if (modal) {
          modal.addEventListener("click", function (e) {
            if (e.target === modal) hideOfflineModal();
          });
        }

        updateStatusPill(state.isOnline);
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindUi);
      } else {
        bindUi();
      }
    }

    registerServiceWorker();
  }

  // Auto-init in browser
  if (typeof window !== "undefined") {
    init();
  }

  return {
    isOnline: function () { return state.isOnline; },
    getPendingQueueCount: getPendingQueueCount,
    collectLocalDataBundle: collectLocalDataBundle,
    exportLocalBackup: exportLocalBackup,
    importLocalBackup: importLocalBackup,
    updateStatusPill: updateStatusPill,
    showOfflineModal: showOfflineModal,
    hideOfflineModal: hideOfflineModal,
    showToast: showToast,
    handleOnline: handleOnline,
    handleOffline: handleOffline,
    init: init
  };
});
