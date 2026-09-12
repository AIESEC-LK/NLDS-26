import * as React from "react";
import { EmailShell } from "../components/EmailShell";
import {
  Text,
  Section,
  Hr,
  Row,
  Column,
} from "@react-email/components";

interface OrderItem {
  name: string;
  itemCode?: string;
  size?: string | null;
  fit?: string | null;
  quantity: number;
  unitPrice: number;
}

interface MerchOrderConfirmationEmailProps {
  orderId?: string;
  recipientName?: string;
  items?: OrderItem[];
  totalAmount?: number;
  entity?: string;
}

export const MerchOrderConfirmationEmail: React.FC<
  MerchOrderConfirmationEmailProps
> = ({
  orderId = "NLDS26-GEN00000",
  recipientName = "AGENT",
  items = [],
  totalAmount = 0,
  entity = "—",
}) => {
    return (
      <EmailShell previewText={`ORDER RECEIVED: ${orderId} | Payment verification in progress`}>
        {/* HUD Top Bar */}
        <Section style={hudTopBar}>
          <Row>
            <Column style={hudColLeft}>
              <Text style={hudBlink}>● STORE UPLINK ACTIVE</Text>
            </Column>
            <Column style={hudColCenter}>
              <Text style={hudClassification}>CLASSIFIED // TOP SECRET</Text>
            </Column>
            <Column style={hudColRight}>
              <Text style={hudClearance}>CLEARANCE: SUPPLY</Text>
            </Column>
          </Row>
        </Section>

        {/* Hero */}
        <Section style={heroContainer}>
          <Text style={protocolCode}>DIRECTIVE REF: NLDS-LK-2026-STORE</Text>
          <Text style={heroTitle}>
            ORDER
            <br />
            <span style={heroTitleHighlight}>RECEIVED.</span>
          </Text>
          <Text style={heroSubtitle}>DEAR AGENT {recipientName.toUpperCase()}</Text>

          <Row style={reticleRow}>
            <Column style={reticleLine} />
            <Column style={reticleScope}>⌖</Column>
            <Column style={reticleLine} />
          </Row>
        </Section>

        {/* Status message */}
        <Section style={dossierCard}>
          <Text style={leadParagraph}>
            Your merchandise order has been{" "}
            <span style={textHighlight}>successfully received</span>.
          </Text>
          <Text style={bodyParagraph}>
            Your payment receipt is currently under review by Mission Control.
            Once your payment is verified, you will receive a confirmation
            notification.
          </Text>
          <Text style={bodyParagraph}>
            If you have any questions in the meantime, do not hesitate to reach
            out to the NLDS 2026 Organising Committee.
          </Text>
        </Section>

        {/* Payment Status Block */}
        <Section style={directiveContainer}>
          <Text style={directiveTag}>// PAYMENT STATUS //</Text>
          <Text style={directiveAction}>PENDING VERIFICATION</Text>
          <Text style={directiveFate}>
            You will be notified once your payment is confirmed.
          </Text>
        </Section>

        {/* Order Dossier Matrix */}
        <Section style={matrixContainer}>
          <Text style={matrixHeader}>▸ ORDER DOSSIER ◂</Text>

          <Row style={matrixRow}>
            <Column style={matrixKeyCol}>
              <Text style={matrixKey}>ORDER ID</Text>
            </Column>
            <Column style={matrixValCol}>
              <Text style={badgeMonoRed}>{orderId}</Text>
            </Column>
          </Row>

          <Hr style={matrixDivider} />

          <Row style={matrixRow}>
            <Column style={matrixKeyCol}>
              <Text style={matrixKey}>PAYMENT STATUS</Text>
            </Column>
            <Column style={matrixValCol}>
              <Text style={badgeAmber}>PENDING VERIFICATION</Text>
            </Column>
          </Row>

          <Hr style={matrixDivider} />

          <Row style={matrixRow}>
            <Column style={matrixKeyCol}>
              <Text style={matrixKey}>ENTITY</Text>
            </Column>
            <Column style={matrixValCol}>
              <Text style={matrixVal}>{entity.toUpperCase()}</Text>
            </Column>
          </Row>

          {items.length > 0 && (
            <>
              <Hr style={matrixDivider} />
              <Text style={itemsHeader}>▸ ITEMS ORDERED ◂</Text>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemNameCol}>
                    <Text style={itemName}>
                      {item.name}
                      {item.size ? ` [${item.size}]` : ""}
                      {item.fit ? ` [${item.fit}]` : ""}
                      {item.itemCode ? ` (${item.itemCode})` : ""}
                    </Text>
                  </Column>
                  <Column style={itemQtyCol}>
                    <Text style={itemQty}>x{item.quantity}</Text>
                  </Column>
                  <Column style={itemPriceCol}>
                    <Text style={itemPrice}>
                      LKR {(item.unitPrice * item.quantity).toLocaleString()}
                    </Text>
                  </Column>
                </Row>
              ))}
            </>
          )}

          <Hr style={matrixDivider} />

          <Row style={matrixRow}>
            <Column style={matrixKeyCol}>
              <Text style={totalKey}>TOTAL AMOUNT</Text>
            </Column>
            <Column style={matrixValCol}>
              <Text style={totalVal}>LKR {totalAmount.toLocaleString()}</Text>
            </Column>
          </Row>
        </Section>

        {/* Command signature */}
        <Section style={commandSignature}>
          <Text style={cmdTitle}>MISSION CONTROL</Text>
          <Text style={cmdEvent}>NLDS 2026</Text>
          <Text style={cmdOrg}>AIESEC IN SRI LANKA</Text>
        </Section>

        {/* Self-destruct footer */}
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
   STYLES
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
const hudBlink = { color: "#FF2424", fontSize: "9px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, letterSpacing: "0.08em", margin: "0" };
const hudClassification = { color: "#E4E4E7", fontSize: "9px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "900", letterSpacing: "0.18em", margin: "0" };
const hudClearance = { color: "#71717A", fontSize: "9px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, letterSpacing: "0.08em", margin: "0" };
const heroContainer = { textAlign: "center" as const, marginBottom: "24px" };
const protocolCode = { color: "#A1A1AA", fontSize: "10px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, letterSpacing: "0.25em", margin: "0 0 8px 0" };
const heroTitle = { color: "#FFFFFF", fontSize: "46px", lineHeight: "0.95", fontWeight: "900", fontFamily: "'Arial Black', Impact, sans-serif", letterSpacing: "-0.01em", margin: "0 0 10px 0", textShadow: "0 0 35px rgba(255, 36, 36, 0.35)" };
const heroTitleHighlight = { color: "#FF2424" };
const heroSubtitle = { color: "#F4F4F5", fontSize: "15px", fontWeight: "800", letterSpacing: "0.22em", margin: "10px 0 16px 0" };
const reticleRow = { margin: "12px 0 20px 0" };
const reticleLine = { height: "1px", backgroundColor: "#27272A", width: "44%" };
const reticleScope = { width: "12%", color: "#FF2424", fontSize: "14px", lineHeight: "1", textAlign: "center" as const };
const dossierCard = { backgroundColor: "#0D0D12", border: "1px solid #1E1E26", borderRadius: "6px", padding: "24px 20px", marginBottom: "24px" };
const leadParagraph = { color: "#D4D4D8", fontSize: "16px", lineHeight: "1.7", margin: "0 0 16px 0" };
const bodyParagraph = { color: "#A1A1AA", fontSize: "14px", lineHeight: "1.8", margin: "0 0 16px 0" };
const textHighlight = { color: "#FFFFFF", fontWeight: "bold" as const };
const directiveContainer = { backgroundColor: "#140507", border: "1px solid #4D090C", borderLeft: "4px solid #FF2424", borderRadius: "4px", padding: "24px 20px", marginBottom: "24px", textAlign: "center" as const };
const directiveTag = { color: "#FF6B6B", fontSize: "10px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, letterSpacing: "0.22em", margin: "0 0 10px 0" };
const directiveAction = { color: "#FBBF24", fontSize: "22px", fontWeight: "900", lineHeight: "1.4", letterSpacing: "0.12em", margin: "0 0 14px 0" };
const directiveFate = { color: "#A1A1AA", fontSize: "12px", fontStyle: "italic", margin: "0" };
const matrixContainer = { backgroundColor: "#0A0A0E", border: "1px solid #1E1E26", borderRadius: "4px", padding: "20px", marginBottom: "28px" };
const matrixHeader = { color: "#FF2424", fontSize: "10px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, letterSpacing: "0.2em", textAlign: "center" as const, margin: "0 0 16px 0", paddingBottom: "10px", borderBottom: "1px solid #1E1E26" };
const matrixRow = { padding: "7px 0" };
const matrixKeyCol = { width: "42%" };
const matrixValCol = { width: "58%", textAlign: "right" as const };
const matrixKey = { color: "#71717A", fontSize: "10px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, letterSpacing: "0.08em", margin: "0" };
const matrixVal = { color: "#F4F4F5", fontSize: "12px", fontWeight: "bold" as const, margin: "0" };
const matrixDivider = { borderColor: "#1E1E26", margin: "4px 0" };
const badgeAmber = { color: "#FBBF24", fontSize: "11px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, margin: "0" };
const badgeMonoRed = { color: "#FF4545", fontSize: "11px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, margin: "0" };
const itemsHeader = { color: "#71717A", fontSize: "10px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, letterSpacing: "0.2em", textAlign: "center" as const, margin: "12px 0 8px 0" };
const itemRow = { padding: "5px 0" };
const itemNameCol = { width: "55%" };
const itemQtyCol = { width: "15%", textAlign: "center" as const };
const itemPriceCol = { width: "30%", textAlign: "right" as const };
const itemName = { color: "#D4D4D8", fontSize: "11px", margin: "0" };
const itemQty = { color: "#A1A1AA", fontSize: "11px", fontFamily: "Courier, 'Courier New', monospace", margin: "0" };
const itemPrice = { color: "#F4F4F5", fontSize: "11px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, margin: "0" };
const totalKey = { color: "#FFFFFF", fontSize: "11px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, letterSpacing: "0.08em", margin: "0" };
const totalVal = { color: "#4ADE80", fontSize: "14px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, margin: "0" };
const commandSignature = { textAlign: "center" as const, marginBottom: "36px" };
const cmdTitle = { color: "#FFFFFF", fontSize: "15px", fontWeight: "900", letterSpacing: "0.22em", margin: "0 0 4px 0" };
const cmdEvent = { color: "#FF2424", fontSize: "12px", fontWeight: "bold" as const, letterSpacing: "0.16em", margin: "0 0 3px 0" };
const cmdOrg = { color: "#71717A", fontSize: "10px", letterSpacing: "0.1em", margin: "0" };
const footerContainer = { textAlign: "center" as const, padding: "20px 0", borderTop: "1px solid #18181C" };
const selfDestructText = { color: "#FF2424", fontSize: "9px", fontFamily: "Courier, 'Courier New', monospace", fontWeight: "bold" as const, letterSpacing: "0.15em", margin: "0 0 6px 0" };
const footerDisclaimer = { color: "#3F3F46", fontSize: "8px", fontFamily: "Courier, 'Courier New', monospace", letterSpacing: "0.08em", margin: "0" };
