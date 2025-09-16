# Envelope CLI

Securely share, lock, and open environment variables with asymmetric/symmetric cryptography.

## Install

- From npm (when published):
```bash
npm i -g envelope-cli
```
- From source (this repo):
```bash
npm run prepare
npm i -g .
```
## Quick start
```bash
# 1) Generate your keys (stores locally under ~/.envelope)
envelope gen

# 2) Encrypt your .env for yourself or your team
#    Run in the project root where .env exists
envelope lock

# 3) Decrypt and create a local .env
envelope open
```

## Commands
- `envelope gen`:
  - Generate a keypair and store your username locally.
  - Options:
    - `--share <NAME>`: team lead/recipient
    - `--project <REPO>`: project name associated with the share
- `envelope lock`: Encrypt `.env` into `.envelope/envelope_enc.txt` and create lockboxes for your team in `.envelope/envelopes.txt`.
- `envelope open`: Decrypt `.envelope/envelope_enc.txt` using your lockbox and write a `.env`.
- `envelope share <project> <team_leader>`: Share your public key for a project with a team leader.
- `envelope pull <project>`: Pull keys shared with you for a project.
- `envelope update <project>`: Pull keys and re-lock the `.env` in one go.

Get help anytime:
```bash
envelope --help
envelope <command> --help
```

## How it works (high-level)
- Public/private keys are stored locally in `~/.envelope`.
- Team public keys are aggregated in `.envelope/envelope_keys.txt`.
- Your `.env` is symmetrically encrypted to `.envelope/envelope_enc.txt`.
- The symmetric key is encrypted per-user (a lockbox) using their public key and stored in `.envelope/envelopes.txt`.

## Troubleshooting
- No banner on install:
  - Ensure postinstall scripts are enabled in your package manager.
  - Run manually: `node dist/post-install.js`.
- Chalk or module errors:
  - Update Node to a recent LTS and reinstall with `npm i -g .`.
- Permission/errors writing files:
  - Ensure you’re in the project directory and `.envelope/` is writable.

## Uninstall
```bash
npm uninstall -g envelope-cli
```

## License
MIT
