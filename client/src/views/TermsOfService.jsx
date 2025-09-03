import { Container, Typography, Box, Divider, Paper } from "@mui/material";

export default function TermsOfService() {
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
          Terms of Service
        </Typography>
      </Box>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, borderRadius: "16px" }}>
            <Typography variant="subtitle2" sx={{  fontWeight: 600, mb: 2 }}>
                Last Updated: September 2025
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                These Terms of Service ("<b>Terms</b>") constitute a binding legal agreement between you (“User,” “you,” or “your”) and <b>JM Premium Health & Beauty</b>, a company organized and existing under the laws of the Republic of the Philippines (“Company,” “we,” “our,” or “us”). By accessing, browsing, or using the Company’s website, purchasing products, or otherwise engaging with our services (collectively, the "<b>Services</b>"), you acknowledge that you have read, understood, and agree to be bound by these Terms and all applicable laws and regulations. If you do not agree, you must immediately cease use of the Services.
            </Typography>
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              1. Eligibility
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                By using the Services, you represent and warrant that you are at least eighteen (18) years of age and have the legal capacity to enter into binding contracts under Philippine law. If you are using the Services on behalf of a business or entity, you represent that you have authority to bind such entity to these Terms.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              2. Products and Orders
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
              <b>2.1 Product Information.</b> All descriptions, images, and specifications of products offered are provided for informational purposes only and are subject to change without notice. We make reasonable efforts to ensure accuracy but disclaim liability for typographical, pricing, or other errors.<br/>
              <b>2.2 Order Acceptance.</b> Submission of an order constitutes an offer to purchase. The Company reserves the right to accept or reject any order at its sole discretion. No order shall be deemed accepted until confirmed in writing or upon commencement of fulfillment.<br/>
              <b>2.3 Risk of Loss.</b> Title and risk of loss for products shall pass to you upon delivery to the carrier.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              3. Pricing and Payment
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
              Prices are quoted in Philippine Pesos unless otherwise stated and are exclusive of shipping, handling, and applicable taxes. Payment must be made in full at the time of order using the Company’s designated payment processors. y providing payment information, you represent and warrant that you are authorized to use the designated method and authorize us to charge your order total. The Company reserves the right to correct any pricing errors and to cancel any order based on incorrect pricing or product availability.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              4. Shipping and Delivery
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.75 }}>
              Delivery times provided are estimates only and not guaranteed. The Company shall not be liable for delays due to events beyond its reasonable control, including but not limited to force majeure, courier delays, or customs clearance. You are responsible for providing accurate shipping information. The Company shall not be liable for undeliverable shipments due to your error.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              5. Returns, Refunds, and Exchanges
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
              All sales are final except as expressly provided herein. Products that are defective, damaged, or incorrectly shipped may be returned within <b>three (3) calendar days</b> of receipt, subject to Company inspection and approval. Opened or perishable goods, including coffee, are not eligible for return. Refunds, where approved, shall be issued to the original method of payment within a commercially reasonable period. Exchanges are limited to replacement of the same product.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              6. Intellectual Property
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                All content, trademarks, trade dress, designs, and materials appearing on the Services are owned or licensed by the Company and protected under applicable intellectual property laws. No license is granted except as expressly authorized in writing.            
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              7. User Conduct
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                You agree not to misuse the Services, including but not limited to engaging in unlawful, fraudulent, or abusive activity; interfering with the operation of the website; or violating the intellectual property rights of the Company or any third party.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              8. Disclaimer of Warranties
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                The Services and products are provided on an “as is” and “as available” basis. To the fullest extent permitted by law, the Company disclaims all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.            
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              9. Limitation of Liability
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                To the maximum extent permitted by applicable law, the Company shall not be liable for any indirect, incidental, consequential, or punitive damages arising from or related to the use of the Services or products. In no event shall the Company’s aggregate liability exceed the total amount paid by you for the specific product giving rise to the claim.            
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              10. Indemnification
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                You agree to indemnify, defend, and hold harmless the Company, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorneys’ fees, arising out of or related to your violation of these Terms or misuse of the Services.            
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              11. Governing Law and Jurisdiction
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to conflict of laws principles. Any dispute shall be submitted exclusively to the proper courts of Quezon City, Metro Manila, to the exclusion of all other venues.            
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              12. Amendments
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                The Company reserves the right to amend these Terms at any time in its sole discretion. Any modifications shall take effect immediately upon posting on the website unless otherwise stated. Continued use of the Services after such posting constitutes acceptance of the revised Terms.            
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              13. Severability
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.           
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
              }}
            >
              14. Entire Agreement
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.75 }}>
                These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and the Company concerning the Services and supersede all prior agreements or understandings.    
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
