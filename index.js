const core = require('@actions/core')
const github = require('@actions/github')

const webhook = require('webhook-discord')

const avatarUrl = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
const defaultUsername = 'GhostOfDoltHub'

// https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#job-context
// maps job status to
const colors = {
    success: '#00ff00',
    cancelled: '#ff9900',
    failure: '#ff0000'
}


async function getDescription() {
  const context = github.context
  const payload = context.payload

  baseDesc = '**Workflow Details:**\n'
              + `- **Repository:** ${context.repository}\n`
              + `- **Actor:** ${context.actor}\n`
              + `- **Workflow:** ${context.workflow}\n`
              + `- **Action:** ${context.action}\n`
              + `- **Event:** ${context.event}\n`
              + `- **Commit:** ${context.commit}\n`
              ;

  if (github.context.eventName == 'pull_request') {
    return baseDesc + '**Pull Request Details**'
        + `- **Author:** ${payload.pull_request.user.login}\n`
        + `- **URL:** ${payload.pull_request.url}\n`
        + `- **Base:** ${payload.pull_request.base.ref}\n`
        + `- **Head:** ${payload.pull_request.head.ref}\n`
        ;
  }
  if (github.context.eventName == 'push') {
    return baseDesc + '**Push Details**'
        + `- **Author:** ${payload.head_commit.author.name}\n`
        + `- **Committer:** ${payload.head_commit.committer.name}\n`
        + `- **Pusher:** ${payload.pusher.name}\n`
        + `- **Commit URL:** ${payload.head_commit.url}\n`
        + `- **Commit Message:** ${payload.head_commit.message}\n`
        ;
  }

  if (github.context.eventName == 'release') {
    return baseDesc + '**Release Details:**\n'
        + `- **Author:** ${payload.release.author.login}\n`
        + `- **Tag:** ${payload.release.tag_name}`
        + payload.release.prerelease ? ' (pre-release)' : ''
        + '\n'
        + `- **Url:** ${payload.release.url}\n`
        ;
  }

  return baseDesc;
}


async function run() {
  try {
      const webhookUrl = core.getInput('webhook-url').replace('/github', '')
      if (!webhook) {
        core.setFailed('The webhook-url parameter is required')
        return;
      }

      const context = github.context;
      const username = 'dolthub-ga-bot'
      const status = github.job.status
      const notifyOnSuccess = core.getInput('notify-on-success');
      const hook = new webhook.Webhook(webhookUrl);

      if (status != 'success' || notifyOnSuccess) {
        const msg = new webhook.MessageBuilder()
                          .setName(username)
                          .setAvatar(avatarUrl)
                          .setColor(colors[status])
                          .setDescription((await getDescription()))
                          .setFooter(`Status: ${status}`)
                          .setTime();
        hook.send(msg)
      }


  } catch (error) {
      core.setFailed(error.message);
  }

}

run();
