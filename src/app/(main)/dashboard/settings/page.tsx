"use client";

import { useEffect, useState } from "react";

import { RefreshCw, Settings as SettingsIcon, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fontOptions } from "@/lib/fonts/registry";
import {
  CONTENT_LAYOUT_OPTIONS,
  NAVBAR_STYLE_OPTIONS,
  SIDEBAR_COLLAPSIBLE_OPTIONS,
  SIDEBAR_VARIANT_OPTIONS,
} from "@/lib/preferences/layout";
import {
  applyContentLayout,
  applyFont,
  applyNavbarStyle,
  applySidebarCollapsible,
  applySidebarVariant,
} from "@/lib/preferences/layout-utils";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { THEME_MODE_OPTIONS, THEME_PRESET_OPTIONS, type ThemeMode, type ThemePreset } from "@/lib/preferences/theme";
import { applyThemeMode, applyThemePreset } from "@/lib/preferences/theme-utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const DEFAULT_ROLES = [
  { label: "Project Admin", value: "project-admin" },
  { label: "Project Editor", value: "project-editor" },
  { label: "Project Viewer", value: "project-viewer" },
];

const DEFAULT_VISIBILITY = [
  { label: "Private", value: "private" },
  { label: "Internal", value: "internal" },
  { label: "Public", value: "public" },
];

const DEFAULT_SESSION_TIMEOUT = [
  { label: "15 minutes", value: "15" },
  { label: "30 minutes", value: "30" },
  { label: "1 hour", value: "60" },
  { label: "4 hours", value: "240" },
];

export default function SettingsPage() {
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const themePreset = usePreferencesStore((state) => state.themePreset);
  const font = usePreferencesStore((state) => state.font);
  const contentLayout = usePreferencesStore((state) => state.contentLayout);
  const navbarStyle = usePreferencesStore((state) => state.navbarStyle);
  const sidebarVariant = usePreferencesStore((state) => state.sidebarVariant);
  const sidebarCollapsible = usePreferencesStore((state) => state.sidebarCollapsible);

  const setThemeMode = usePreferencesStore((state) => state.setThemeMode);
  const setThemePreset = usePreferencesStore((state) => state.setThemePreset);
  const setFont = usePreferencesStore((state) => state.setFont);
  const setContentLayout = usePreferencesStore((state) => state.setContentLayout);
  const setNavbarStyle = usePreferencesStore((state) => state.setNavbarStyle);
  const setSidebarVariant = usePreferencesStore((state) => state.setSidebarVariant);
  const setSidebarCollapsible = usePreferencesStore((state) => state.setSidebarCollapsible);

  const [workspaceName, setWorkspaceName] = useState("CRMP Dashboard");
  const [teamEmail, setTeamEmail] = useState("team@company.com");
  const [defaultVisibility, setDefaultVisibility] = useState("private");
  const [defaultRole, setDefaultRole] = useState("project-viewer");
  const [requireApproval, setRequireApproval] = useState(true);
  const [autoAssignment, setAutoAssignment] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [mobileAlerts, setMobileAlerts] = useState(true);
  const [notificationCadence, setNotificationCadence] = useState("daily");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!saveMessage) return;
    const timeout = window.setTimeout(() => setSaveMessage(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [saveMessage]);

  const handleThemeModeChange = async (value: ThemeMode | "") => {
    if (!value) return;
    const resolved = applyThemeMode(value);
    setThemeMode(value);
    persistPreference("theme_mode", value);
    persistPreference("theme_preset", themePreset);
    persistPreference("font", font);
    persistPreference("content_layout", contentLayout);
    persistPreference("navbar_style", navbarStyle);
    persistPreference("sidebar_variant", sidebarVariant);
    persistPreference("sidebar_collapsible", sidebarCollapsible);
    if (resolved === "dark") {
      document.documentElement.classList.add("dark");
    }
  };

  const handleThemePresetChange = async (value: ThemePreset | "") => {
    if (!value) return;
    applyThemePreset(value);
    setThemePreset(value);
    persistPreference("theme_preset", value);
  };

  const handleFontChange = async (value: string | "") => {
    if (!value) return;
    applyFont(value);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    setFont(value as any);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    persistPreference("font", value as any);
  };

  const handleContentLayoutChange = async (value: string | "") => {
    if (!value) return;
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    applyContentLayout(value as any);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    setContentLayout(value as any);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    persistPreference("content_layout", value as any);
  };

  const handleNavbarStyleChange = async (value: string | "") => {
    if (!value) return;
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    applyNavbarStyle(value as any);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    setNavbarStyle(value as any);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    persistPreference("navbar_style", value as any);
  };

  const handleSidebarVariantChange = async (value: string | "") => {
    if (!value) return;
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    applySidebarVariant(value as any);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    setSidebarVariant(value as any);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    persistPreference("sidebar_variant", value as any);
  };

  const handleSidebarCollapsibleChange = async (value: string | "") => {
    if (!value) return;
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    applySidebarCollapsible(value as any);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    setSidebarCollapsible(value as any);
    // biome-ignore lint/suspicious/noExplicitAny: preferences
    persistPreference("sidebar_collapsible", value as any);
  };

  const handleSaveSettings = () => {
    setSaveMessage("Your dashboard settings have been updated.");
  };

  const handleRestoreDefaults = () => {
    handleThemeModeChange(PREFERENCE_DEFAULTS.theme_mode);
    handleThemePresetChange(PREFERENCE_DEFAULTS.theme_preset);
    handleFontChange(PREFERENCE_DEFAULTS.font);
    handleContentLayoutChange(PREFERENCE_DEFAULTS.content_layout);
    handleNavbarStyleChange(PREFERENCE_DEFAULTS.navbar_style);
    handleSidebarVariantChange(PREFERENCE_DEFAULTS.sidebar_variant);
    handleSidebarCollapsibleChange(PREFERENCE_DEFAULTS.sidebar_collapsible);
    setWorkspaceName("CRMP Dashboard");
    setTeamEmail("team@company.com");
    setDefaultVisibility("private");
    setDefaultRole("project-viewer");
    setRequireApproval(true);
    setAutoAssignment(true);
    setInAppAlerts(true);
    setWeeklyDigest(false);
    setMobileAlerts(true);
    setNotificationCadence("daily");
    setSessionTimeout("30");
    setTwoFactorEnabled(true);
    setSaveMessage("System defaults were restored.");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="space-y-3 rounded-xl border border-border bg-muted p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <SettingsIcon className="h-5 w-5" />
          <span className="font-medium text-sm uppercase tracking-[0.16em]">Settings</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-semibold text-3xl">Workspace settings</h1>
          <p className="max-w-2xl text-muted-foreground text-sm">
            Configure the dashboard experience for your team: appearance, workflow defaults, security, and
            notifications.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace configuration</CardTitle>
              <CardDescription>
                Primary settings for project access, team notifications, and workspace defaults.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace name</Label>
                  <Input
                    id="workspace-name"
                    value={workspaceName}
                    onChange={(event) => setWorkspaceName(event.target.value)}
                    placeholder="CRMP Dashboard"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-email">Team email</Label>
                  <Input
                    id="team-email"
                    type="email"
                    value={teamEmail}
                    onChange={(event) => setTeamEmail(event.target.value)}
                    placeholder="team@company.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="default-visibility">Default project visibility</Label>
                  <Select value={defaultVisibility} onValueChange={(value) => setDefaultVisibility(value)}>
                    <SelectTrigger id="default-visibility" className="w-full">
                      <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {DEFAULT_VISIBILITY.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-role">Default access role</Label>
                  <Select value={defaultRole} onValueChange={(value) => setDefaultRole(value)}>
                    <SelectTrigger id="default-role" className="w-full">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {DEFAULT_ROLES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-md border border-border bg-background p-4">
                  <div>
                    <p className="font-medium text-sm">Require approval for new projects</p>
                    <p className="text-muted-foreground text-xs">
                      Control whether new project creation is routed through review.
                    </p>
                  </div>
                  <Switch
                    checked={requireApproval}
                    onCheckedChange={(checked) => setRequireApproval(Boolean(checked))}
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border border-border bg-background p-4">
                  <div>
                    <p className="font-medium text-sm">Automated task assignment</p>
                    <p className="text-muted-foreground text-xs">
                      Enable team-wide assignment suggestions for new projects.
                    </p>
                  </div>
                  <Switch checked={autoAssignment} onCheckedChange={(checked) => setAutoAssignment(Boolean(checked))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification & alert controls</CardTitle>
              <CardDescription>Fine-tune how your team receives updates and summaries across the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-md border border-border bg-background p-4">
                <div>
                  <p className="font-medium text-sm">In-app updates</p>
                  <p className="text-muted-foreground text-xs">
                    Show progress alerts and reminders inside the dashboard.
                  </p>
                </div>
                <Switch checked={inAppAlerts} onCheckedChange={(checked) => setInAppAlerts(Boolean(checked))} />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-background p-4">
                <div>
                  <p className="font-medium text-sm">Email digest</p>
                  <p className="text-muted-foreground text-xs">
                    Send a weekly summary of project activity and proposals.
                  </p>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={(checked) => setWeeklyDigest(Boolean(checked))} />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-background p-4">
                <div>
                  <p className="font-medium text-sm">Mobile alerts</p>
                  <p className="text-muted-foreground text-xs">Push notifications for high-priority updates.</p>
                </div>
                <Switch checked={mobileAlerts} onCheckedChange={(checked) => setMobileAlerts(Boolean(checked))} />
              </div>
              <div className="rounded-md border border-border bg-background p-4">
                <p className="font-medium text-sm">Notification cadence</p>
                <p className="text-muted-foreground text-xs">
                  Select how often your team receives consolidated messages.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {[
                    { label: "Instant", value: "instant" },
                    { label: "Hourly", value: "hourly" },
                    { label: "Daily", value: "daily" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={notificationCadence === option.value ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => setNotificationCadence(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & layout</CardTitle>
              <CardDescription>Adjust branding, theme, and navigation behavior for the dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme-preset">Theme preset</Label>
                  <Select value={themePreset} onValueChange={handleThemePresetChange}>
                    <SelectTrigger id="theme-preset" className="w-full">
                      <SelectValue placeholder="Preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {THEME_PRESET_OPTIONS.map((preset) => (
                          <SelectItem key={preset.value} value={preset.value}>
                            {preset.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme-mode">Theme mode</Label>
                  <ToggleGroup value={themeMode} type="single" onValueChange={handleThemeModeChange}>
                    {THEME_MODE_OPTIONS.map((option) => (
                      <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="font">Font family</Label>
                  <Select value={font} onValueChange={handleFontChange}>
                    <SelectTrigger id="font" className="w-full">
                      <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fontOptions.map((option) => (
                          <SelectItem key={option.key} value={option.key}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="layout">Content layout</Label>
                  <ToggleGroup value={contentLayout} type="single" onValueChange={handleContentLayoutChange}>
                    {CONTENT_LAYOUT_OPTIONS.map((option) => (
                      <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="navbar-style">Navbar behavior</Label>
                  <ToggleGroup value={navbarStyle} type="single" onValueChange={handleNavbarStyleChange}>
                    {NAVBAR_STYLE_OPTIONS.map((option) => (
                      <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sidebar-style">Sidebar style</Label>
                  <ToggleGroup value={sidebarVariant} type="single" onValueChange={handleSidebarVariantChange}>
                    {SIDEBAR_VARIANT_OPTIONS.map((option) => (
                      <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar-collapse">Sidebar collapse mode</Label>
                <ToggleGroup value={sidebarCollapsible} type="single" onValueChange={handleSidebarCollapsibleChange}>
                  {SIDEBAR_COLLAPSIBLE_OPTIONS.map((option) => (
                    <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security & access</CardTitle>
              <CardDescription>Configure authentication, session timeout, and identity controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session timeout</Label>
                <Select value={sessionTimeout} onValueChange={(value) => setSessionTimeout(value)}>
                  <SelectTrigger id="session-timeout" className="w-full">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DEFAULT_SESSION_TIMEOUT.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-background p-4">
                <div>
                  <p className="font-medium text-sm">Two-factor authentication</p>
                  <p className="text-muted-foreground text-xs">
                    Require a second verification factor for secure access.
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(checked) => setTwoFactorEnabled(Boolean(checked))}
                />
              </div>
              <div className="rounded-md border border-border bg-background p-4">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Security review</span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm">
                  Keep the dashboard secure by enforcing strong session rules and enabling MFA for all administrators.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-base">Save configuration</p>
            <p className="text-muted-foreground text-sm">
              Use the controls below to apply your changes and keep the dashboard aligned with your team’s operating
              model.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleRestoreDefaults}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Restore defaults
            </Button>
            <Button onClick={handleSaveSettings}>Save settings</Button>
          </div>
        </div>
        {saveMessage ? (
          <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3 text-primary text-sm">
            {saveMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}
