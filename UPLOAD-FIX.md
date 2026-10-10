# Video upload diagnostic update · 0.8.2

This update includes all previous changes. The posting composer now names each stage: checking service, reading file, creating upload link, transferring video, and processing. Errors appear beside the selected video. API calls time out after 35 seconds; browser video transfers with no progress for 45 seconds stop with an actionable error.

Mux direct-upload CORS now uses the requesting browser origin after Gather has validated that origin. Previously it always used PUBLIC_ORIGIN, which could block uploading when using another allowed address, such as the Render address. Native uploads without an Origin header use the normalized PUBLIC_ORIGIN. Unapproved browser origins remain blocked.

Install using INSTALL-THIS-UPDATE.md. Retry a small local video. If it fails, report the stage and exact inline error. This corrects an identified origin mismatch risk; it does not establish the cause of your current production problem. Live Mux/Render and device verification remain required.

A visual percentage bar appears for post and shop uploads. It measures file transfer only; processing remains a separate named stage. Preparation starts at 0% and does not invent progress.
