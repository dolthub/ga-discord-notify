## Background
This is an action for sending notifications to the DoltHub team about events on our various code repositories.


## Details
In order to make a job notify Discord of it's status, along with useful metadata, simply append the following YAML to the job definition:
```yaml
- name: Discord Notify
  if: always()
  uses: dolthub/ga-discord-notify@master
  with:
    job-status: ${{ job.status }}
    webhook-url: ${{ secrets.DISCORD_WEBHOOK }}
    notify-on-success: false
```

This ensures that this step _always_ runs, passes the status to the action for parsing, and provides a webhook URL for sending the message to be rendered in Discord.

`notify-on-success` is used for release notifications. Our general policy is that we notify on failed and cancelled jobs, and all releases.

## Channels
Note that here we use `secrets.DISCORD_WEBHOOK`. This webhook will send notifications to a specific channel. Users can easily add webhooks for other channels to the secrets of their repository to get specific information sent to a channel.
