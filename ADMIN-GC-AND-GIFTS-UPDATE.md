# Admin GC, member wallets and themed gifts · 0.8.6

Includes the marketplace Selling / Looking-for / Trading composer and all prior updates.

## Enable your owner admin access
In Render, open your Gather web service → Environment. Add/update ADMIN_EMAIL to the exact email you use to sign into Gather (not a username). Save and deploy. Verify that account's email, sign out/in, then open Admin panel. This ZIP does not change your Render configuration or identify which production account belongs to you.

## GC distribution
Admin panel → Admin GC distribution lets the verified owner issue whole-credit GC amounts to themselves or any active account without a funded admin wallet. There is no admin issuance budget; each request accepts up to 100 decimal digits for implementation size limits. Balances use arbitrary-precision arithmetic and decimal text storage. An infinity balance is not stored. Choose recipient, GC or Test GC, purpose and an audit reason. Review the exact grant, then Confirm and distribute. The wallet update and immutable application ledger entry are one database transaction. Retrying the same request key does not grant twice; a changed payload with a reused key is rejected.

GC grants can be labeled purchase, reimbursement, reward or other. Test GC uses its own balance and testing purpose. Every grant records admin, recipient, amount, balance after, timestamp, purpose and reason. The panel shows the latest 100 grants. Members see their own latest 100 entries. Grant notification preferences apply. Keep your existing database and persistent disk: the ledger and balances live there. Database operators still control the underlying data.

All existing users receive zero-balance wallet records automatically unless already present. New signups receive wallets at registration. Settings → My GC wallet is available to every user and shows GC and separate Test GC balances. There are no free automatic credits assigned to regular users.

GC issuance is working for internal balances. Checkout, user transfers, gift purchase/sending, external payments and US cash-out are still disabled. A purchase/reimbursement audit purpose does not execute a payment, refund an external charge, or make issued GC withdrawable. The admin panel's funding authority does not bypass disabled transaction features.

## Gifts
45 gift previews in Gather, Sports, Books, Gaming, Gardening, Fishing, Beauty, Music, Food, Fitness, Tech, Art, Travel and Pets. Filter by interest, then tap to preview rise, spin, pulse or burst animations. Examples include Court Spark, Chapter Champion, Harvest High Five, Captain's Catch, Mic Magic and Garden Glow. Prices remain proposed. No GC is charged while transactions are disabled.

## Validation and limits
Owner authorization, verified email, wallet privacy, exact large balances, separate Test GC, idempotent retries, invalid amounts and disabled gift purchasing are tested. The calls friend-picker API context was corrected and covered by a test. Follow INSTALL-THIS-UPDATE.md. No production deployment or actual payment/provider/device testing was performed here.
