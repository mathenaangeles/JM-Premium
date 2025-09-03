import { Container, Typography, Box, Divider, Paper, List, ListItem } from "@mui/material";

export default function RefundPolicy() {
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
        <Typography variant="h4">Refund & Returns Policy</Typography>
      </Box>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, borderRadius: "16px" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Last Updated: September 2025
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
            This Refund & Returns Policy (“<b>Policy</b>”) applies to purchases from <b>JM Premium Health & Beauty</b> (“<b>JM Premium</b>,” “we,” “us,” or “our”) made through our website. It is intended to comply with the Consumer Act of the Philippines (R.A. 7394) and related DTI guidance while reserving our legitimate business rights. This Policy forms part of, and should be read together with, our Terms of Service and Privacy Policy.
          </Typography>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            1. Scope; Change-of-Mind
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
            We accept returns and refunds only for products that are <b>defective, damaged, or incorrectly shipped</b> upon delivery. <b>Change-of-mind returns are not accepted.</b> This approach is consistent with Philippine consumer protection rules, which recognize the remedies of repair, replacement, or refund for defective or non-conforming goods.
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            2. Return Window & Eligibility
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
            (a) You must submit a return request within <b>three (3) calendar days</b> from receipt of the product (“Return Window”).<br/>
            (b) Items must be returned in their <b>original condition</b> with all seals, tags, manuals, and packaging included, except where the defect was discovered only upon opening in the ordinary course of inspection.<br/>
            (c) We may <b>inspect and verify</b> the claimed defect or shipping error before approving any remedy.
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Non-Returnable Items
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
          <ul>
            <li>Opened, consumed, or partially used consumables, including <b>coffee</b>, unless defective;</li>
            <li>Personal care items (e.g., <b>soaps</b>) once opened or unsealed, unless defective;</li>
            <li>Free gifts, samples, and promotional items;</li>
            <li>Items damaged due to misuse, neglect, improper storage, or unauthorized alteration.</li>
          </ul>
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            3. How to File a Return or Refund
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
            Please contact us within the Return Window with: (i) order number; (ii) item SKU; (iii) description of the issue; (iv) <b>clear photos/videos</b> of the item, packaging, and courier waybill. We may issue a Return Merchandise Authorization (“<b>RMA</b>”) and return instructions. Returns without an RMA may be refused.
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
            You are responsible for reasonable return shipping costs unless we determine the product is defective, damaged in transit, or incorrectly shipped. We may provide a prepaid label or arrange pickup at our discretion.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            4. Available Remedies (Order of Preference)
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
            Subject to inspection and applicable law, JM Premium may, at its reasonable discretion, provide one of the following remedies: <b>(i) repair</b>, <b>(ii) replacement</b> with the same or equivalent item (subject to availability), or <b>(iii) refund</b> of the purchase price (exclusive of shipping/handling, unless the defect or error is confirmed). We may require return of the defective item prior to issuing any remedy.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            5. Refund Method & Timing
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
            Approved refunds are issued to the <b>original payment method</b>. Processing times may vary based on the <b>payment channel’s rules</b> and your issuing bank’s timelines. Where the channel does not support direct refunds, we may provide refund via store credit or alternative method as permitted by law. Any shipping fee refund is limited to cases of confirmed defect or our fulfillment error.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            6. Risk of Loss; Title
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
            Risk of loss passes upon carrier pickup from our facility. Please inspect deliveries upon receipt and report visible transit damage within the Return Window.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            7. Chargebacks & Disputes
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
            If you initiate a chargeback while a return/refund request is pending, we may suspend processing until the card network or payment channel issues a decision. You agree to cooperate with our reasonable requests for information during investigations.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            8. Exclusions; Abuse
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
            This Policy does not cover damage arising from misuse, improper storage, or failure to follow instructions. We reserve the right to refuse or limit returns in cases of suspected policy abuse or fraud, consistent with applicable law.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            9. Amendments
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
            We may amend this Policy at any time by posting the updated version on our website. Changes apply to purchases made after the effective date, unless otherwise required by law.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
