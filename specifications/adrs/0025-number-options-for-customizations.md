# Number Options for Customizations

## Context and Problem Statement

* We need to decide what options to give the user for customizing the length of a work session, short break, and long break

## Considered Options

* More Customization: Make the range of available options very large and allow the user to choose any number in that range using a slide
* Less Customization: Provide a couple of set options for the user to choose from that are relatively close to the default value

## Decision Outcome

Chosen option: Less Customization

* We want to stay fairly true to the original pomodoro technique, so we don't want to let the user change the lengths of these periods by that much
* If we have large ranges, the ratio of work session length to short break length could go as low as 1:1, when it supposed to be 5:1, which completely destroys the effectiveness of the pomodoro technique and does not help the user focus
