import * as React from "react";
import { EmailShell } from "../components/EmailShell";
import { Text, Section, Hr, Row, Column, Img } from "@react-email/components";

interface RegistrationSuccessEmailProps {
    missionId: string;
}

interface VPContact {
    name: string;
    position: string;
    phone: string;
    email: string;
}

const VP_CONTACTS: VPContact[] = [
    {
        name: "Agent Sarah Chen",
        position: "VP of Operations",
        phone: "+94 77 123 4567",
        email: "sarah.chen@aiesec.lk"
    },
    {
        name: "Agent Marcus Webb",
        position: "VP of Talent",
        phone: "+94 77 234 5678",
        email: "marcus.webb@aiesec.lk"
    },
    {
        name: "Agent Elena Rodriguez",
        position: "VP of Partnerships",
        phone: "+94 77 345 6789",
        email: "elena.rodriguez@aiesec.lk"
    }
];

export const RegistrationSuccessEmail = ({
    missionId,
}: RegistrationSuccessEmailProps) => {
    return (
        <EmailShell previewText="MISSION RECEIVED | Your NLDS 2026 application is under review">
            {/* Top Secret Stamp with Logo Placeholder */}
            <Section style={topBar}>
                <Row>
                    <Column style={stampCol}>
                        <Text style={stamp}>▲ CLASSIFIED ▲</Text>
                    </Column>
                    <Column style={logoCol}>
                        <Text style={logoText}>NLDS 2026</Text>
                    </Column>
                    <Column style={stampCol}>
                        <Text style={stamp}>EYES ONLY</Text>
                    </Column>
                </Row>
            </Section>

            {/* Hero Section - Bold Header like reference image */}
            <Section style={heroContainer}>
                <Text style={heroPrefix}>▸ MISSION IMPOSSIBLE ◂</Text>
                <Text style={heroTitle}>
                    DEAR FUTURE
                    <br />
                    <span style={heroTitleHighlight}>AGENT</span>
                </Text>
                <Text style={heroSubtitle}>NLDS 2026</Text>

                {/* Decorative line */}
                <Section style={decorativeLine}>
                    <Text style={lineSymbol}>◆ ◆ ◆ ◆ ◆</Text>
                </Section>
            </Section>

            {/* Main Content */}
            <Section style={contentContainer}>
                <Text style={paragraph}>
                    Your application has been <span style={highlightText}>successfully received</span>.
                    <br />
                    <span style={redText}>But this is only the beginning.</span>
                </Text>

                <Text style={paragraph}>
                    Your profile has now entered <span style={highlightText}>MISSION CONTROL</span>,
                    where every application will be carefully reviewed. Out of the many who
                    step forward, only those selected will receive clearance to join the mission.
                </Text>

                <Text style={paragraph}>
                    At <span style={highlightText}>NLDS 2026</span>, you'll be challenged to{" "}
                    <span style={highlightText}>
                        think beyond limits, work with unexpected allies,
                        discover new perspectives, and create stories worth bringing back home.
                    </span>
                </Text>
            </Section>

            {/* Mission Brief - Big Bold Section */}
            <Section style={briefContainer}>
                <Text style={briefLabel}>// MISSION BRIEF //</Text>

                <Text style={briefText}>
                    For now, your mission is simple:
                </Text>

                <Text style={objective}>
                    STAY ALERT.
                    <br />
                    STAY READY.
                    <br />
                    AWAIT YOUR CLEARANCE.
                </Text>

                <Text style={fateText}>Your fate will be revealed soon.</Text>
            </Section>

            {/* Status Dossier - Like reference image style */}
            <Section style={statusContainer}>
                <Text style={statusHeader}>▸ MISSION DOSSIER ◂</Text>

                <Row style={statusRow}>
                    <Column style={statusLabelCol}>
                        <Text style={statusLabel}>MISSION STATUS</Text>
                    </Column>
                    <Column style={statusValueCol}>
                        <Text style={statusValue}>APPLICATION RECEIVED</Text>
                    </Column>
                </Row>

                <Row style={statusRow}>
                    <Column style={statusLabelCol}>
                        <Text style={statusLabel}>ACCESS LEVEL</Text>
                    </Column>
                    <Column style={statusValueCol}>
                        <Text style={statusValue}>UNDER REVIEW</Text>
                    </Column>
                </Row>

                <Row style={statusRow}>
                    <Column style={statusLabelCol}>
                        <Text style={statusLabel}>MISSION DATES</Text>
                    </Column>
                    <Column style={statusValueCol}>
                        <Text style={statusValue}>09 • 10 • 11 OCTOBER 2026</Text>
                    </Column>
                </Row>

                <Row style={statusRow}>
                    <Column style={statusLabelCol}>
                        <Text style={statusLabel}>MISSION ID</Text>
                    </Column>
                    <Column style={statusValueCol}>
                        <Text style={statusValue}>{missionId}</Text>
                    </Column>
                </Row>
            </Section>

            {/* Quote Section with Visual Element */}
            <Section style={quoteContainer}>
                <Row>
                    <Column style={quoteLineCol}>
                        <Text style={quoteLine}>▬▬▬▬▬</Text>
                    </Column>
                    <Column style={quoteContentCol}>
                        <Text style={quote}>
                            "Until your clearance arrives, consider this your first mission:"
                        </Text>
                        <Text style={quoteHighlight}>
                            Stay curious.
                        </Text>
                    </Column>
                    <Column style={quoteLineCol}>
                        <Text style={quoteLine}>▬▬▬▬▬</Text>
                    </Column>
                </Row>
            </Section>

            {/* Signature */}
            <Section style={signatureContainer}>
                <Text style={closing}>
                    MISSION CONTROL
                </Text>
                <Text style={signature}>
                    NLDS 2026
                </Text>
                <Text style={muted}>
                    AIESEC in Sri Lanka
                </Text>
            </Section>

            {/* VP Contacts - Centered Grid */}
            <Section style={vpContainer}>
                <Text style={vpHeader}>▸ CONTACT YOUR HANDLER ◂</Text>

                <Section style={vpGrid}>
                    {VP_CONTACTS.map((vp, index) => (
                        <Section key={index} style={vpCard}>
                            <Text style={vpName}>{vp.name}</Text>
                            <Text style={vpPosition}>{vp.position}</Text>
                            <Text style={vpPhone}>{vp.phone}</Text>
                            <Text style={vpEmail}>{vp.email}</Text>
                            {index < VP_CONTACTS.length - 1 && <Hr style={vpDivider} />}
                        </Section>
                    ))}
                </Section>
            </Section>

            {/* Footer */}
            <Text style={classifiedBottom}>
                END OF TRANSMISSION • THIS MESSAGE WILL SELF-DESTRUCT
            </Text>
        </EmailShell>
    );
};

/* ─────────────────────────────────────────────
   STYLES - ENHANCED CREATIVE THEME
───────────────────────────────────────────── */

const topBar = {
    marginBottom: '25px',
    padding: '10px 0',
    borderBottom: '1px solid #1A1A1A',
    borderTop: '1px solid #1A1A1A',
};

const stampCol = {
    width: '30%',
    textAlign: 'center' as const,
};

const logoCol = {
    width: '40%',
    textAlign: 'center' as const,
};

const stamp = {
    color: "#EA0000",
    fontSize: "8px",
    fontWeight: "bold",
    letterSpacing: "0.25em",
    margin: "0",
    textTransform: "uppercase" as const,
};

const logoText = {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "900",
    letterSpacing: "0.15em",
    margin: "0",
};

const heroContainer = {
    marginBottom: '30px',
    textAlign: 'center' as const,
};

const heroPrefix = {
    color: "#666666",
    fontSize: "9px",
    fontWeight: "bold",
    letterSpacing: "0.3em",
    margin: "0 0 15px 0",
    textTransform: "uppercase" as const,
};

const heroTitle = {
    color: "#FFFFFF",
    fontSize: "48px",
    lineHeight: "1.1",
    fontWeight: "900",
    letterSpacing: "0.05em",
    margin: "0 0 5px 0",
    textTransform: "uppercase" as const,
    textShadow: "0 0 40px rgba(234, 0, 0, 0.2)",
};

const heroTitleHighlight = {
    color: "#EA0000",
    textShadow: "0 0 60px rgba(234, 0, 0, 0.3)",
};

const heroSubtitle = {
    color: "#888888",
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "0.2em",
    margin: "0 0 15px 0",
};

const decorativeLine = {
    margin: "10px 0",
};

const lineSymbol = {
    color: "#333333",
    fontSize: "10px",
    letterSpacing: "0.3em",
    margin: "0",
};

const contentContainer = {
    marginBottom: '15px',
};

const paragraph = {
    color: "#D8D0C7",
    fontSize: "15px",
    lineHeight: "2",
    margin: "0 0 20px 0",
};

const redText = {
    color: "#EA0000",
};

const highlightText = {
    color: "#FFFFFF",
    fontWeight: "bold",
};

const briefContainer = {
    marginTop: "30px",
    marginBottom: "30px",
    padding: "35px 25px",
    backgroundColor: "#080808",
    border: "1px solid #1A1A1A",
    borderLeft: "5px solid #EA0000",
    borderRadius: "4px",
};

const briefLabel = {
    color: "#666666",
    fontSize: "9px",
    fontWeight: "bold",
    letterSpacing: "0.25em",
    margin: "0 0 10px 0",
    textTransform: "uppercase" as const,
};

const briefText = {
    color: "#D8D0C7",
    fontSize: "14px",
    margin: "0 0 15px 0",
};

const objective = {
    color: "#FFFFFF",
    fontSize: "22px",
    fontWeight: "900",
    lineHeight: "1.8",
    letterSpacing: "0.12em",
    margin: "0 0 15px 0",
    textShadow: "0 0 30px rgba(234, 0, 0, 0.15)",
};

const fateText = {
    color: "#888888",
    fontSize: "13px",
    fontStyle: "italic",
    margin: "0",
};

const statusContainer = {
    marginTop: "30px",
    marginBottom: "30px",
    padding: "25px 20px",
    backgroundColor: "#050505",
    border: "1px solid #1A1A1A",
    borderRadius: "4px",
};

const statusHeader = {
    color: "#EA0000",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "0.3em",
    margin: "0 0 20px 0",
    paddingBottom: "12px",
    borderBottom: "1px solid #1A1A1A",
    textAlign: "center" as const,
    textTransform: "uppercase" as const,
};

const statusRow = {
    marginBottom: "14px",
};

const statusLabelCol = {
    width: "40%",
};

const statusValueCol = {
    width: "60%",
};

const statusLabel = {
    color: "#666666",
    fontSize: "9px",
    letterSpacing: "0.2em",
    margin: "0",
    textTransform: "uppercase" as const,
};

const statusValue = {
    color: "#F1ECE5",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    margin: "0",
    textAlign: "right" as const,
};

const quoteContainer = {
    marginTop: "35px",
    marginBottom: "35px",
    padding: "20px 0",
};

const quoteLineCol = {
    width: "15%",
    textAlign: "center" as const,
};

const quoteContentCol = {
    width: "70%",
    textAlign: "center" as const,
};

const quoteLine = {
    color: "#333333",
    fontSize: "10px",
    margin: "0",
};

const quote = {
    color: "#A8A09A",
    fontSize: "14px",
    lineHeight: "1.8",
    fontStyle: "italic",
    margin: "0 0 8px 0",
};

const quoteHighlight = {
    color: "#EA0000",
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    margin: "0",
};

const signatureContainer = {
    marginTop: "20px",
    textAlign: "center" as const,
};

const closing = {
    color: "#FFFFFF",
    fontSize: "16px",
    fontWeight: "900",
    letterSpacing: "0.3em",
    margin: "0 0 4px 0",
    textTransform: "uppercase" as const,
};

const signature = {
    color: "#EA0000",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "0.15em",
    margin: "0",
};

const muted = {
    color: "#666666",
    fontSize: "11px",
    letterSpacing: "0.08em",
    margin: "4px 0 0 0",
};

const vpContainer = {
    marginTop: "40px",
    paddingTop: "30px",
    borderTop: "2px solid #1A1A1A",
};

const vpHeader = {
    color: "#666666",
    fontSize: "9px",
    fontWeight: "bold",
    letterSpacing: "0.25em",
    margin: "0 0 20px 0",
    textAlign: "center" as const,
    textTransform: "uppercase" as const,
};

const vpGrid = {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    flexDirection: "column" as const,
    maxWidth: "400px",
    margin: "0 auto",
};

const vpCard = {
    textAlign: "center" as const,
    padding: "12px 0",
    width: "100%",
};

const vpName = {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "0.05em",
    margin: "0 0 2px 0",
};

const vpPosition = {
    color: "#EA0000",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "0.08em",
    margin: "0 0 4px 0",
};

const vpPhone = {
    color: "#999999",
    fontSize: "12px",
    letterSpacing: "0.05em",
    margin: "0",
};

const vpEmail = {
    color: "#666666",
    fontSize: "11px",
    letterSpacing: "0.05em",
    margin: "0",
};

const vpDivider = {
    borderColor: "#1A1A1A",
    margin: "10px 0",
    width: "60%",
};

const classifiedBottom = {
    color: "#333333",
    fontSize: "7px",
    letterSpacing: "0.3em",
    textAlign: "center" as const,
    margin: "35px 0 0 0",
    textTransform: "uppercase" as const,
};