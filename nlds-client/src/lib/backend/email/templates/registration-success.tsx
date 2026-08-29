import * as React from "react";
import { EmailShell } from "../components/EmailShell";
import {
    Text,
    Section,
    Hr,
    Row,
    Column,
    Img,
    Link,
    Button
} from "@react-email/components";

interface RegistrationSuccessEmailProps {
    missionId?: string;
    recipientName?: string;
}

interface VPContact {
    name: string;
    position: string;
    phone: string;
    email: string;
}

const VP_CONTACTS: VPContact[] = [
    {
        name: "Sayuri Pathirana",
        position: "Organizing Committee Vice President - Delegates",
        phone: "+94 76 415 4527",
        email: "sayuri.pathirana@aiesec.net",
    },
    {
        name: "Monali Edirisinghe",
        position: "Organizing Committee Vice President - Delegates",
        phone: "+94 74 243 0091",
        email: "monaliedirisinghe@aiesec.net"
    },
    {
        name: "Sayuni Salwathura",
        position: "Organizing Committee Vice President - Delegates",
        phone: "+94 71 176 7132",
        email: "sayuni.salwathura@aiesec.net"
    }
];

export const RegistrationSuccessEmail: React.FC<RegistrationSuccessEmailProps> = ({
    missionId = "IMF-NLDS-2026-X88",
    recipientName = "AGENT",
}) => {
    return (
        <EmailShell previewText="MISSION RECEIVED | Your NLDS 2026 application is under review">

            {/* Top Classified Security HUD Header */}
            <Section style={hudTopBar}>
                <Row>
                    <Column style={hudColLeft}>
                        <Text style={hudBlink}>● IMF UPLINK ACTIVE</Text>
                    </Column>
                    <Column style={hudColCenter}>
                        <Text style={hudClassification}>CLASSIFIED // TOP SECRET</Text>
                    </Column>
                    <Column style={hudColRight}>
                        <Text style={hudClearance}>CLEARANCE: OMEGA</Text>
                    </Column>
                </Row>
            </Section>

            {/* Cinematic Hero Section */}
            <Section style={heroContainer}>
                {/* Tactical Emblem Badge */}
                <Section style={emblemContainer}>
                    <Img
                        src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=140&h=140&q=80"
                        alt="IMF Tactical Crest"
                        width="68"
                        height="68"
                        style={tacticalEmblem}
                    />
                </Section>

                <Text style={protocolCode}>DIRECTIVE REF: NLDS-LK-2026</Text>

                <Text style={heroTitle}>
                    MISSION
                    <br />
                    <span style={heroTitleHighlight}>RECEIVED.</span>
                </Text>

                <Text style={heroSubtitle}>
                    DEAR FUTURE {recipientName.toUpperCase()}
                </Text>

                {/* Reticle / Crosshair Divider */}
                <Row style={reticleRow}>
                    <Column style={reticleLine} />
                    <Column style={reticleScope}>⌖</Column>
                    <Column style={reticleLine} />
                </Row>
            </Section>

            {/* Narrative Briefing Dossier */}
            <Section style={dossierCard}>
                <Text style={leadParagraph}>
                    Your application has been <span style={textHighlight}>successfully received</span>.
                    <br />
                    <span style={textRedAlert}>But this is only the beginning.</span>
                </Text>

                <Text style={bodyParagraph}>
                    Your profile has now entered <span style={textHighlight}>MISSION CONTROL</span>, where
                    every candidate will be thoroughly vetted. Out of the many operatives who step
                    forward, only those selected will receive official clearance to deploy into the mission arena.
                </Text>

                {/* Tactical Operation Banner */}
                <Section style={bannerWrapper}>
                    <Img
                        src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80"
                        alt="Mission Control Center"
                        style={cinematicBanner}
                    />
                    <Section style={bannerOverlay}>
                        <Text style={bannerOverlayText}>IMPOSSIBLE MISSIONS FORCE // ACTIVE SURVEILLANCE</Text>
                    </Section>
                </Section>

                <Text style={bodyParagraph}>
                    At <span style={textHighlight}>NLDS 2026</span>, you will be challenged to{" "}
                    <span style={textHighlight}>
                        think beyond limits, operate alongside unexpected allies, uncover new perspectives,
                        and forge stories worth bringing back home.
                    </span>
                </Text>
            </Section>

            {/* Primary Directive Callout Box */}
            <Section style={directiveContainer}>
                <Text style={directiveTag}>// PRIMARY PROTOCOL //</Text>

                <Text style={directiveSub}>For now, your mission is simple:</Text>

                <Text style={directiveAction}>
                    STAY ALERT.
                    <br />
                    STAY READY.
                    <br />
                    AWAIT YOUR CLEARANCE.
                </Text>

                <Text style={directiveFate}>Your fate will be revealed soon.</Text>
            </Section>

            {/* Mission Dossier Status Matrix */}
            <Section style={matrixContainer}>
                <Text style={matrixHeader}>▸ MISSION DOSSIER SPECIFICATIONS ◂</Text>

                <Row style={matrixRow}>
                    <Column style={matrixKeyCol}>
                        <Text style={matrixKey}>MISSION STATUS</Text>
                    </Column>
                    <Column style={matrixValCol}>
                        <Text style={badgeGreen}>APPLICATION RECEIVED</Text>
                    </Column>
                </Row>

                <Row style={matrixRow}>
                    <Column style={matrixKeyCol}>
                        <Text style={matrixKey}>ACCESS LEVEL</Text>
                    </Column>
                    <Column style={matrixValCol}>
                        <Text style={badgeAmber}>UNDER REVIEW</Text>
                    </Column>
                </Row>

                <Row style={matrixRow}>
                    <Column style={matrixKeyCol}>
                        <Text style={matrixKey}>OPERATION TIMELINE</Text>
                    </Column>
                    <Column style={matrixValCol}>
                        <Text style={matrixVal}>9TH, 10TH &amp; 11TH OCTOBER 2026</Text>
                    </Column>
                </Row>

                <Row style={matrixRow}>
                    <Column style={matrixKeyCol}>
                        <Text style={matrixKey}>ENCRYPTED ID</Text>
                    </Column>
                    <Column style={matrixValCol}>
                        <Text style={badgeMonoRed}>{missionId}</Text>
                    </Column>
                </Row>
            </Section>

            {/* Directive Quote Element */}
            <Section style={quoteContainer}>
                <Text style={quotePrefix}>"Until your clearance arrives, consider this your first mission:"</Text>
                <Text style={quoteMain}>Stay curious.</Text>
                <Section style={quoteBar} />
            </Section>

            {/* Merch / Field Kit Intercept Teaser */}
            <Section style={merchInterceptContainer}>
                <Text style={merchHeader}>▸ IMF FIELD GEAR PROTOCOL ◂</Text>
                <Img
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"
                    alt="Tactical Merchandise Kit"
                    style={merchImage}
                />
                <Button style={merchButton} href="https://aiesec.lk">
                    SECURE YOUR GEAR PACK
                </Button>
            </Section>

            {/* Mission Command Authority Signature */}
            <Section style={commandSignature}>
                <Text style={cmdTitle}>MISSION CONTROL</Text>
                <Text style={cmdEvent}>NLDS 2026</Text>
                <Text style={cmdOrg}>AIESEC IN SRI LANKA</Text>
            </Section>

            {/* Handler Contact Dossiers (3 Delegate VPs) */}
            <Section style={handlerContainer}>
                <Text style={handlerHeader}>▸ CONTACT YOUR FIELD HANDLERS ◂</Text>

                {VP_CONTACTS.map((vp, index) => (
                    <Section key={index} style={handlerCard}>
                        <Row>
                            <Column style={handlerInfoCol}>
                                <Text style={handlerName}>{vp.name}</Text>
                                <Text style={handlerPosition}>{vp.position}</Text>

                                <Text style={handlerMeta}>
                                    <span style={handlerLabel}>MOBILE: </span>
                                    <Link href={`tel:${vp.phone.replace(/\s+/g, '')}`} style={handlerLink}>
                                        {vp.phone}
                                    </Link>
                                </Text>

                                <Text style={handlerMeta}>
                                    <span style={handlerLabel}>UPLINK: </span>
                                    <Link href={`mailto:${vp.email}`} style={handlerLink}>
                                        {vp.email}
                                    </Link>
                                </Text>
                            </Column>
                        </Row>
                        {index < VP_CONTACTS.length - 1 && <Hr style={handlerDivider} />}
                    </Section>
                ))}
            </Section>

            {/* Self-Destruct Footer Sequence */}
            <Section style={footerContainer}>
                <Text style={selfDestructText}>
                    ⚠ THIS TRANSMISSION WILL SELF-DESTRUCT IN 5 SECONDS ⚠
                </Text>
                <Text style={footerDisclaimer}>
                    IMF SECURE TRANSMISSION // AIESEC IN SRI LANKA // ALL RIGHTS RESERVED
                </Text>
            </Section>

        </EmailShell>
    );
};

/* ─────────────────────────────────────────────
   TACTICAL MISSION IMPOSSIBLE CSS-IN-JS
───────────────────────────────────────────── */

const hudTopBar = {
    backgroundColor: "#0A0A0E",
    borderBottom: "1px solid #1E1E26",
    padding: "10px 14px",
    marginBottom: "28px",
};

const hudColLeft = { width: "33%", textAlign: "left" as const };
const hudColCenter = { width: "34%", textAlign: "center" as const };
const hudColRight = { width: "33%", textAlign: "right" as const };

const hudBlink = {
    color: "#FF2424",
    fontSize: "9px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    margin: "0",
};

const hudClassification = {
    color: "#E4E4E7",
    fontSize: "9px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "900",
    letterSpacing: "0.18em",
    margin: "0",
};

const hudClearance = {
    color: "#71717A",
    fontSize: "9px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    margin: "0",
};

const heroContainer = {
    textAlign: "center" as const,
    marginBottom: "24px",
};

const emblemContainer = {
    marginBottom: "12px",
    display: "inline-block",
};

const tacticalEmblem = {
    borderRadius: "50%",
    border: "2px solid #FF2424",
    boxShadow: "0 0 16px rgba(255, 36, 36, 0.4)",
    display: "inline-block",
};

const protocolCode = {
    color: "#A1A1AA",
    fontSize: "10px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    letterSpacing: "0.25em",
    margin: "0 0 8px 0",
};

const heroTitle = {
    color: "#FFFFFF",
    fontSize: "46px",
    lineHeight: "0.95",
    fontWeight: "900",
    fontFamily: "'Arial Black', Impact, sans-serif",
    letterSpacing: "-0.01em",
    margin: "0 0 10px 0",
    textShadow: "0 0 35px rgba(255, 36, 36, 0.35)",
};

const heroTitleHighlight = {
    color: "#FF2424",
};

const heroSubtitle = {
    color: "#F4F4F5",
    fontSize: "15px",
    fontWeight: "800",
    letterSpacing: "0.22em",
    margin: "10px 0 16px 0",
};

const reticleRow = {
    margin: "12px 0 20px 0",
};

const reticleLine = {
    height: "1px",
    backgroundColor: "#27272A",
    width: "44%",
};

const reticleScope = {
    width: "12%",
    color: "#FF2424",
    fontSize: "14px",
    lineHeight: "1",
    textAlign: "center" as const,
};

const dossierCard = {
    backgroundColor: "#0D0D12",
    border: "1px solid #1E1E26",
    borderRadius: "6px",
    padding: "24px 20px",
    marginBottom: "24px",
};

const leadParagraph = {
    color: "#D4D4D8",
    fontSize: "16px",
    lineHeight: "1.7",
    margin: "0 0 16px 0",
};

const bodyParagraph = {
    color: "#A1A1AA",
    fontSize: "14px",
    lineHeight: "1.8",
    margin: "0 0 16px 0",
};

const textHighlight = {
    color: "#FFFFFF",
    fontWeight: "bold",
};

const textRedAlert = {
    color: "#FF2424",
    fontWeight: "800",
};

const bannerWrapper = {
    borderRadius: "4px",
    overflow: "hidden" as const,
    border: "1px solid #27272A",
    margin: "20px 0",
};

const cinematicBanner = {
    width: "100%",
    height: "160px",
    objectFit: "cover" as const,
    display: "block",
};

const bannerOverlay = {
    backgroundColor: "rgba(10, 10, 14, 0.85)",
    padding: "6px 10px",
    borderTop: "1px solid rgba(255, 36, 36, 0.4)",
};

const bannerOverlayText = {
    color: "#E4E4E7",
    fontSize: "9px",
    fontFamily: "Courier, 'Courier New', monospace",
    letterSpacing: "0.15em",
    margin: "0",
    textAlign: "center" as const,
};

const directiveContainer = {
    backgroundColor: "#140507",
    border: "1px solid #4D090C",
    borderLeft: "4px solid #FF2424",
    borderRadius: "4px",
    padding: "24px 20px",
    marginBottom: "24px",
    textAlign: "center" as const,
};

const directiveTag = {
    color: "#FF6B6B",
    fontSize: "10px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    letterSpacing: "0.22em",
    margin: "0 0 10px 0",
};

const directiveSub = {
    color: "#D4D4D8",
    fontSize: "13px",
    margin: "0 0 14px 0",
};

const directiveAction = {
    color: "#FFFFFF",
    fontSize: "22px",
    fontWeight: "900",
    lineHeight: "1.6",
    letterSpacing: "0.12em",
    margin: "0 0 14px 0",
    textShadow: "0 0 20px rgba(255, 36, 36, 0.25)",
};

const directiveFate = {
    color: "#A1A1AA",
    fontSize: "12px",
    fontStyle: "italic",
    margin: "0",
};

const matrixContainer = {
    backgroundColor: "#0A0A0E",
    border: "1px solid #1E1E26",
    borderRadius: "4px",
    padding: "20px",
    marginBottom: "28px",
};

const matrixHeader = {
    color: "#FF2424",
    fontSize: "10px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    letterSpacing: "0.2em",
    textAlign: "center" as const,
    margin: "0 0 16px 0",
    paddingBottom: "10px",
    borderBottom: "1px solid #1E1E26",
};

const matrixRow = {
    padding: "7px 0",
};

const matrixKeyCol = { width: "42%" };
const matrixValCol = { width: "58%", textAlign: "right" as const };

const matrixKey = {
    color: "#71717A",
    fontSize: "10px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    margin: "0",
};

const matrixVal = {
    color: "#F4F4F5",
    fontSize: "12px",
    fontWeight: "bold",
    margin: "0",
};

const badgeGreen = {
    color: "#4ADE80",
    fontSize: "11px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    margin: "0",
};

const badgeAmber = {
    color: "#FBBF24",
    fontSize: "11px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    margin: "0",
};

const badgeMonoRed = {
    color: "#FF4545",
    fontSize: "11px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    margin: "0",
};

const quoteContainer = {
    textAlign: "center" as const,
    padding: "16px 20px",
    marginBottom: "32px",
};

const quotePrefix = {
    color: "#71717A",
    fontSize: "11px",
    fontFamily: "Courier, 'Courier New', monospace",
    letterSpacing: "0.06em",
    margin: "0 0 8px 0",
};

const quoteMain = {
    color: "#FFFFFF",
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "0.15em",
    margin: "0 0 10px 0",
};

const quoteBar = {
    width: "48px",
    height: "2px",
    backgroundColor: "#FF2424",
    margin: "0 auto",
};

const merchInterceptContainer = {
    backgroundColor: "#0A0A0E",
    border: "1px solid #1E1E26",
    borderRadius: "6px",
    padding: "20px",
    textAlign: "center" as const,
    marginBottom: "32px",
};

const merchHeader = {
    color: "#A1A1AA",
    fontSize: "10px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    letterSpacing: "0.2em",
    margin: "0 0 14px 0",
};

const merchImage = {
    width: "100%",
    borderRadius: "4px",
    marginBottom: "16px",
};

const merchButton = {
    backgroundColor: "#FF2424",
    color: "#FFFFFF",
    borderRadius: "3px",
    padding: "12px 26px",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "0.14em",
    textDecoration: "none",
    display: "inline-block",
};

const commandSignature = {
    textAlign: "center" as const,
    marginBottom: "36px",
};

const cmdTitle = {
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: "900",
    letterSpacing: "0.22em",
    margin: "0 0 4px 0",
};

const cmdEvent = {
    color: "#FF2424",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.16em",
    margin: "0 0 3px 0",
};

const cmdOrg = {
    color: "#71717A",
    fontSize: "10px",
    letterSpacing: "0.1em",
    margin: "0",
};

const handlerContainer = {
    borderTop: "1px solid #27272A",
    paddingTop: "24px",
    marginBottom: "28px",
};

const handlerHeader = {
    color: "#71717A",
    fontSize: "10px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    letterSpacing: "0.2em",
    textAlign: "center" as const,
    margin: "0 0 20px 0",
};

const handlerCard = {
    marginBottom: "12px",
};

const handlerBadgeCol = {
    width: "32%",
    verticalAlign: "top" as const,
};

const handlerInfoCol = {
    width: "68%",
    paddingLeft: "12px",
};

const handlerCallsign = {
    color: "#FF2424",
    fontSize: "9px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    backgroundColor: "#180608",
    border: "1px solid #4D090C",
    borderRadius: "3px",
    padding: "4px 6px",
    textAlign: "center" as const,
    margin: "0",
};

const handlerName = {
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: "bold",
    margin: "0 0 2px 0",
};

const handlerPosition = {
    color: "#A1A1AA",
    fontSize: "11px",
    margin: "0 0 6px 0",
};

const handlerMeta = {
    color: "#71717A",
    fontSize: "11px",
    margin: "0 0 3px 0",
};

const handlerLabel = {
    fontFamily: "Courier, 'Courier New', monospace",
    color: "#52525B",
};

const handlerLink = {
    color: "#E4E4E7",
    textDecoration: "none",
};

const handlerTextMuted = {
    color: "#A1A1AA",
};

const handlerDivider = {
    borderColor: "#18181C",
    margin: "14px 0",
};

const footerContainer = {
    textAlign: "center" as const,
    padding: "20px 0",
    borderTop: "1px solid #18181C",
};

const selfDestructText = {
    color: "#FF2424",
    fontSize: "9px",
    fontFamily: "Courier, 'Courier New', monospace",
    fontWeight: "bold",
    letterSpacing: "0.15em",
    margin: "0 0 6px 0",
};

const footerDisclaimer = {
    color: "#3F3F46",
    fontSize: "8px",
    fontFamily: "Courier, 'Courier New', monospace",
    letterSpacing: "0.08em",
    margin: "0",
};