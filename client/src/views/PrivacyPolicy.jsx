import { Container, Typography, Box, Divider, Paper } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 6, md: 3 },
          textAlign: "center",
        }}
      >
        <Typography variant="h4">
          Privacy Policy
        </Typography>
      </Box>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, borderRadius: "16px" }}>
            <Typography variant="subtitle2" sx={{  fontWeight: 600, mb: 2 }}>
                Last Updated: September 2025
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                This Privacy Policy (“<b>Policy</b>") explains how <b>JM Premium Health & Beauty</b> (“Company,” “we,” “our,” or “us”) collects, uses, discloses, retains, and safeguards personal data of individuals (“you,” “your,” or “User”) in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) of the Republic of the Philippines, its Implementing Rules and Regulations, and other applicable laws.
                <br/><br/>By accessing or using our website, services, or products, you acknowledge that you have read, understood, and agreed to the terms of this Policy.
            </Typography>
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              1. Information We Collect
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                We may collect and process the following categories of personal data, whether provided directly by you, collected automatically, or obtained from third parties:
                <ul>
                    <li>Identifying information such as your name, date of birth, gender, and government-issued identification details.</li>
                    <li>Contact information such as your phone number, email address, and billing/shipping address.</li>
                    <li>Financial and payment information, including credit/debit card numbers and account details, processed through authorized payment service providers.</li>
                    <li>Transactional data such as order history, purchase records, and account activity.</li>
                    <li>Technical information such as IP addresses, device identifiers, browsing patterns, cookies, and geolocation data.</li>
                    <li>Any other information voluntarily submitted through our platforms, customer support, or promotional activities.</li>
                </ul>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              2. Legal Bases for Processing
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
              We process your personal data under the following lawful bases:
              <ul>
                <li>Performance of a contract (e.g., fulfilling your orders and processing payments).</li>
                <li>Compliance with legal and regulatory requirements.</li>
                <li>Legitimate interests of the Company, including fraud prevention, business optimization, and marketing.</li>
                <li>Consent, where expressly required under applicable law.</li>
              </ul>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              3. How We Use Your Information
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                We may use your personal data for the following purposes:
                <ul>
                    <li>To process, fulfill, and deliver your purchases.</li>
                    <li>To verify identity, detect fraud, and ensure security of transactions.</li>
                    <li>To communicate with you regarding your account, purchases, promotions, and service updates.</li>
                    <li>To analyze consumer behavior and improve our products, services, and digital platforms.</li>
                    <li>To enforce our Terms of Service and protect the rights, property, and safety of the Company, our users, and the public.</li>
                    <li>To comply with applicable laws, regulations, lawful orders, and government requests.</li>
                    <li>For internal business purposes, including audits, data analysis, and research.</li>
                </ul>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              4. Data Sharing and Disclosure
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.75 }}>
                We do not sell or trade your personal data. However, we may disclose it to:
                <ul>
                    <li>Authorized third-party service providers (e.g., logistics companies, payment processors, IT support, marketing platforms).</li>
                    <li>Professional advisers such as auditors, accountants, and legal counsel.</li>
                    <li>Affiliates, subsidiaries, or successors in the event of a corporate restructuring, merger, or acquisition.</li>
                    <li>Government authorities, regulators, or courts when disclosure is required by law, legal process, or to protect the Company’s rights.</li>
                </ul>
                Personal data may be transferred and stored outside the Philippines subject to appropriate safeguards in compliance with applicable data protection laws.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              5. Data Retention
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                We retain personal data for as long as necessary to fulfill the purposes outlined in this Policy, or as required by law, whichever is longer. The Company reserves the right to retain information beyond account termination where legally permissible to protect its interests, enforce agreements, or comply with regulatory obligations.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              6. Security of Data
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                We implement reasonable organizational, physical, and technical measures to protect your personal data. However, no method of transmission or storage is completely secure. To the fullest extent permitted by law, the Company disclaims liability for any unauthorized access, alteration, or disclosure of personal data beyond its reasonable control.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              7. Your Rights
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                Subject to applicable law, you may exercise the following rights under the Data Privacy Act:
                <ul>
                    <li>The right to be informed of the processing of your personal data.</li>
                    <li>The right to access your personal data.</li>
                    <li>The right to object to processing, subject to legitimate business or legal grounds.</li>
                    <li>The right to request correction of inaccurate data.</li>
                    <li>The right to request deletion or blocking of data that is incomplete, outdated, or unlawfully obtained.</li>
                    <li>The right to withdraw consent, where processing is based on consent.</li>
                </ul>
                Requests must be made in writing and may be subject to verification requirements. The Company reserves the right to deny requests that are unreasonable, repetitive, or inconsistent with legal and contractual obligations.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              8. Limitation of Liability
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                By using our services, you acknowledge that:
                <ul>
                    <li>The Company shall not be liable for any damages resulting from the use, disclosure, or loss of data caused by events beyond its reasonable control, including but not limited to cyberattacks, system failures, or third-party actions.</li>
                    <li>The Company makes no warranties, express or implied, regarding absolute security of personal data.</li>
                </ul>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              9. Amendments
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                We reserve the right to amend or update this Policy at any time without prior notice, subject to applicable legal requirements. Changes shall take effect immediately upon posting on our website. Your continued use of our services constitutes acceptance of the revised Policy.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
