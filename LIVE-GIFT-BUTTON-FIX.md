# Gather 0.9.1 — Live gift button fix

The phone browser studio previously displayed gift animations but omitted gift-sending controls. This update places **Gift · send to a live participant** beside the live controls on the regular live screen and the phone browser studio. Native Gather also retains its gift controls alongside the browser-launch button. Shop → Gifts now has a working **Go to Live · send a gift** button instead of a disabled navigation button.

## Send a live gift

1. Deploy this cumulative update using INSTALL-THIS-UPDATE.md, then refresh both accounts' browsers. Reopen the phone browser studio from Gather so it loads the updated build.
2. Join Live or Podcasts and press **Gift** near the live controls.
3. In a phone browser that is not already signed in, press **Gift · sign in to send** and sign in to Gather on that same screen. Your video connection stays in place. Only your normal Gather browser session is stored; no Gather account token is added to the studio link.
4. Select the host or accepted guest. A sole eligible recipient is selected automatically. You cannot gift yourself.
5. Choose a gift and GC or Test GC, then press **Send gift**. You must be signed in, verified and have sufficient credits in that selected wallet. GC and Test GC cannot be mixed.
6. Other viewers should see the animation over the recipient's camera or camera-off tile. Check both wallets: the sender is debited once and the recipient credited once.

If the server returns HTTP 502, that still needs investigation in Render's runtime logs; adding the button cannot repair an unavailable API. The earlier /admin/official 502 has not been diagnosed from logs yet.

Includes automatic AI page managers, clearer GC distribution, Me → GC Wallet and all previous updates. Cash-out and shop checkout remain disabled. Actual phone/browser video and sign-in testing is still required after deployment.
