import type { INodeProperties } from 'n8n-workflow';
import {
  accountSelector,
  inboxSelector,
  conversationSelector,
  contactSelector,
  messageTemplateSelector,
} from '../../shared/descriptions';

const showOnlyForConversation = {
  resource: ['conversation'],
};

const conversationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForConversation,
    },
    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new conversation',
        action: 'Create conversation',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a specific conversation',
        action: 'Get conversation',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List conversations',
        action: 'List conversations',
      },
      {
        name: 'Send Message',
        value: 'sendMessage',
        description: 'Send a text message in conversation',
        action: 'Send text message in conversation',
      },
      {
        name: 'Send File',
        value: 'sendFile',
        description: 'Send a file message in conversation',
        action: 'Send file message in conversation',
      },
      {
        name: 'Send with Template',
        value: 'sendTemplate',
        description: 'Send a WhatsApp template message',
        action: 'Send template message',
      },
      {
        name: 'List Messages',
        value: 'listMessages',
        description: 'List messages in conversation',
        action: 'List messages in conversation',
      },
      {
        name: 'Delete Message',
        value: 'deleteMessage',
        description: 'Delete a message and its attachments from conversation',
        action: 'Delete message from conversation',
      },
      {
        name: 'List Attachments',
        value: 'listAttachments',
        description: 'List attachments in conversation',
        action: 'List attachments in conversation',
      },
      {
        name: 'Download Attachment',
        value: 'downloadAttachment',
        description: 'Download an attachment from a conversation message',
        action: 'Download attachment from conversation',
      },
      {
        name: 'Assign Agent',
        value: 'assignAgent',
        description: 'Assign an agent to conversation',
        action: 'Assign agent to conversation',
      },
      {
        name: 'Assign Team',
        value: 'assignTeam',
        description: 'Assign a team to conversation',
        action: 'Assign team to conversation',
      },
      {
        name: 'Add Labels',
        value: 'addLabels',
        description: 'Append labels to conversation',
        action: 'Append labels to conversation and keeps other labels intact',
      },
      {
        name: 'Remove Labels',
        value: 'removeLabels',
        description: 'Remove labels from conversation',
        action: 'Remove labels from conversation',
      },
      {
        name: 'Update Labels',
        value: 'updateLabels',
        description: 'Update conversation labels',
        action: 'Update conversation labels replacing existing labels',
      },
      {
        name: 'List Labels',
        value: 'listLabels',
        description: 'List all labels of a conversation',
        action: 'List conversation labels',
      },
      {
        name: 'Toggle Status',
        value: 'toggleStatus',
        description: 'Toggle conversation status between open, pending, resolved, and snoozed',
        action: 'Toggle conversation status',
      },
      {
        name: 'Set Priority',
        value: 'setPriority',
        description: 'Set priority for conversation',
        action: 'Set conversation priority',
      },
      {
        name: 'Add Custom Attributes',
        value: 'addCustomAttributes',
        description: 'Add custom attributes on conversation keeping existing attributes intact',
        action: 'Add custom attributes on conversation',
      },
      {
        name: 'Remove Custom Attributes',
        value: 'removeCustomAttributes',
        description: 'Remove custom attributes from conversation',
        action: 'Remove custom attributes from conversation',
      },
      {
        name: 'Set Custom Attributes',
        value: 'setCustomAttributes',
        description: 'Set custom attributes on conversation overriding existing attributes',
        action: 'Set custom attributes on conversation',
      },
      {
        name: 'Update Last Seen',
        value: 'updateLastSeen',
        description: 'Update the last seen timestamp of the conversation',
        action: 'Update last seen timestamp',
      },
      {
        name: 'Update Presence',
        value: 'updatePresence',
        description: 'Define presence status as off, typing or recording',
        action: 'Define presence status',
      },
      {
        name: 'Mark Unread',
        value: 'markUnread',
        description: 'Mark conversation as unread',
        action: 'Mark conversation as unread',
      },
      {
        name: 'Update Attachment Metadata',
        value: 'updateAttachmentMeta',
        description: 'Update metadata on an existing attachment (e.g., transcription, description)',
        action: 'Update attachment metadata',
      },
    ],
    default: 'list',
  },
];

const updatePresenceFields: INodeProperties[] = [
  {
    displayName: 'Typing Status',
    name: 'typingStatus',
    type: 'options',
    default: 'on',
    required: true,
    options: [
      { name: 'Typing', value: 'on' },
      { name: 'Recording', value: 'recording' },
      { name: 'Off', value: 'off' },
    ],
    description: 'The presence/typing status to set',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['updatePresence'],
      },
    },
  },
  {
    displayName: 'Private',
    name: 'isPrivate',
    type: 'boolean',
    default: false,
    description: 'Whether the presence indicator is for a private note',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['updatePresence'],
      },
    },
  },
];

const conversationFields: INodeProperties[] = [
  {
    ...accountSelector,
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['create', 'list', 'get', 'toggleStatus', 'assignAgent', 'assignTeam', 'addLabels', 'removeLabels', 'updateLabels', 'listLabels', 'addCustomAttributes', 'removeCustomAttributes', 'setCustomAttributes', 'setPriority', 'sendMessage', 'sendFile', 'sendTemplate', 'updateLastSeen', 'updatePresence', 'markUnread', 'listMessages', 'listAttachments', 'updateAttachmentMeta', 'deleteMessage'],
      },
    },
  },
  {
    ...inboxSelector,
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['list', 'get', 'toggleStatus', 'assignAgent', 'assignTeam', 'addLabels', 'removeLabels', 'updateLabels', 'listLabels', 'addCustomAttributes', 'removeCustomAttributes', 'setCustomAttributes', 'setPriority', 'sendMessage', 'sendFile', 'updateLastSeen', 'updatePresence', 'markUnread', 'listMessages', 'listAttachments', 'updateAttachmentMeta', 'deleteMessage'],
      },
    },
  },
  {
    ...conversationSelector,
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['get', 'toggleStatus', 'assignAgent', 'assignTeam', 'addLabels', 'removeLabels', 'updateLabels', 'listLabels', 'addCustomAttributes', 'removeCustomAttributes', 'setCustomAttributes', 'setPriority', 'sendMessage', 'sendFile', 'sendTemplate', 'updateLastSeen', 'updatePresence', 'markUnread', 'listMessages', 'listAttachments', 'updateAttachmentMeta', 'deleteMessage'],
      },
    },
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    default: 'resolved',
    options: [
      { name: 'Open', value: 'open' },
      { name: 'Resolved', value: 'resolved' },
      { name: 'Pending', value: 'pending' },
      { name: 'Snoozed', value: 'snoozed' },
    ],
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['toggleStatus'],
      },
    },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Assignee Type',
        name: 'assignee_type',
        type: 'options',
        default: 'all',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Assigned', value: 'assigned' },
          { name: 'Me', value: 'me' },
          { name: 'Unassigned', value: 'unassigned' },
        ],
      },
      {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
        displayName: 'Labels',
        name: 'labels',
        type: 'multiOptions',
        default: [],
        description: 'Filter by labels. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        typeOptions: {
          loadOptionsMethod: 'loadLabelsWithTitleValueOptions',
        },
      },
      {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        description: 'Page number for pagination',
      },
      {
        displayName: 'Search',
        name: 'q',
        type: 'string',
        default: '',
        description: 'Filter conversations with messages containing this search term',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        default: 'open',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Open', value: 'open' },
          { name: 'Pending', value: 'pending' },
          { name: 'Resolved', value: 'resolved' },
          { name: 'Snoozed', value: 'snoozed' },
        ],
      },
      {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
        displayName: 'Team',
        name: 'team_id',
        type: 'options',
        default: '',
        description: 'Filter by team. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        typeOptions: {
          loadOptionsMethod: 'loadTeamsOptions',
        },
      },
    ],
  },
  {
    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
    displayName: 'Agent',
    name: 'agentId',
    type: 'options',
    default: '',
    required: true,
    description: 'Select the agent to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    typeOptions: {
      loadOptionsMethod: 'loadAgentsOptions',
    },
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['assignAgent'],
      },
    },
  },
  {
    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
    displayName: 'Team',
    name: 'teamId',
    type: 'options',
    default: '',
    required: true,
    description: 'Select the team to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    typeOptions: {
      loadOptionsMethod: 'loadTeamsOptions',
    },
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['assignTeam'],
      },
    },
  },
  {
    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
    displayName: 'Labels',
    name: 'labels',
    type: 'multiOptions',
    default: [],
    description: 'Select labels to add or remove. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    typeOptions: {
      loadOptionsMethod: 'loadLabelsWithTitleValueOptions',
    },
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['addLabels', 'removeLabels', 'updateLabels'],
      },
    },
  },
  {
    ...inboxSelector,
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['create'],
      },
    },
  },
  {
    ...contactSelector,
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Specify Custom Attributes',
    name: 'specifyCustomAttributes',
    type: 'options',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['addCustomAttributes', 'setCustomAttributes'],
      },
    },
    options: [
      {
        name: 'From Definitions',
        value: 'definition',
        description: 'Select from pre-defined conversation attributes',
      },
      {
        name: 'Using Fields Below',
        value: 'keypair',
      },
      {
        name: 'JSON',
        value: 'json',
      },
    ],
    default: 'definition',
  },
  {
    displayName: 'Custom Attributes',
    name: 'customAttributesDefinition',
    type: 'fixedCollection',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['addCustomAttributes', 'setCustomAttributes'],
        specifyCustomAttributes: ['definition'],
      },
    },
    typeOptions: {
      multipleValues: true,
    },
    placeholder: 'Add Attribute',
    default: {
      attributes: [],
    },
    options: [
      {
        name: 'attributes',
        displayName: 'Attribute',
        values: [
          {
            // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
            displayName: 'Attribute',
            name: 'key',
            type: 'options',
            default: '',
            description: 'Select the custom attribute. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
            typeOptions: {
              loadOptionsMethod: 'loadConversationCustomAttributeDefinitionsOptions',
            },
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description: 'Value of the custom attribute',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Custom Attributes',
    name: 'customAttributesKeypair',
    type: 'fixedCollection',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['addCustomAttributes', 'setCustomAttributes'],
        specifyCustomAttributes: ['keypair'],
      },
    },
    typeOptions: {
      multipleValues: true,
    },
    placeholder: 'Add Attribute',
    default: {
      attributes: [
        {
          name: '',
          value: '',
        },
      ],
    },
    options: [
      {
        name: 'attributes',
        displayName: 'Attribute',
        values: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            description: 'Name of the custom attribute',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description: 'Value of the custom attribute',
          },
        ],
      },
    ],
  },
  {
    displayName: 'JSON',
    name: 'customAttributesJson',
    type: 'json',
    default: '{}',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['addCustomAttributes', 'setCustomAttributes'],
        specifyCustomAttributes: ['json'],
      },
    },
  },
  {
    displayName: 'Attributes to Remove',
    name: 'customAttributeKeysToRemove',
    type: 'multiOptions',
    default: [],
    required: true,
    description: 'Select the custom attributes to remove. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    typeOptions: {
      loadOptionsMethod: 'loadConversationCustomAttributeDefinitionsOptions',
    },
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['removeCustomAttributes'],
      },
    },
  },
  {
    displayName: 'Priority',
    name: 'priority',
    type: 'options',
    default: 'null',
    required: true,
    // eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
    options: [
      { name: 'None', value: 'null' },
      { name: 'Low', value: 'low' },
      { name: 'Medium', value: 'medium' },
      { name: 'High', value: 'high' },
      { name: 'Urgent', value: 'urgent' },
    ],
    description: 'Priority level for the conversation',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['setPriority'],
      },
    },
  },
  {
    displayName: 'Snooze Until',
    name: 'snoozeUntil',
    type: 'dateTime',
    default: '',
    description: 'Timestamp until which the conversation is snoozed',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['toggleStatus'],
        status: ['snoozed'],
      },
    },
  },
  {
    displayName: 'Content',
    name: 'content',
    type: 'string',
    default: '',
    description: 'Text content of the message to send. Can be empty when sending a reaction.',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['sendMessage'],
      },
    },
    typeOptions: {
      rows: 4,
    },
  },
  {
    displayName: 'Reply To',
    name: 'replyToMessageId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Message to reply to (will set in_reply_to in content attributes)',
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['sendMessage'],
      },
    },
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        typeOptions: {
          searchListMethod: 'searchMessages',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'e.g. 12345',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^[0-9]+$',
              errorMessage: 'Message ID must be a number',
            },
          },
        ],
      },
    ],
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        ...showOnlyForConversation,
        operation: ['sendMessage'],
      },
    },
    // eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
    options: [
      {
        displayName: 'Private Note',
        name: 'private',
        type: 'boolean',
        default: false,
        description: 'Whether this is a private note (not visible to customer)',
      },
      {
        displayName: 'Is Reaction',
        name: 'is_reaction',
        type: 'boolean',
        default: false,
        description: 'Whether this message is a reaction to another message',
      },
      {
        displayName: 'Content Attributes',
        name: 'content_attributes',
        type: 'fixedCollection',
        placeholder: 'Add Content Attribute',
        default: {},
        description: 'Additional content attributes for the message',
        options: [
          {
            displayName: 'Specify Content Attributes',
            name: 'values',
            values: [
              {
                displayName: 'Input Method',
                name: 'inputMethod',
                type: 'options',
                default: 'pairs',
                options: [
                  {
                    name: 'Using Fields Below',
                    value: 'pairs',
                  },
                  {
                    name: 'JSON',
                    value: 'json',
                  },
                ],
              },
              {
                displayName: 'Attributes',
                name: 'attributes',
                type: 'fixedCollection',
                typeOptions: {
                  multipleValues: true,
                },
                default: {},
                displayOptions: {
                  show: {
                    inputMethod: ['pairs'],
                  },
                },
                options: [
                  {
                    displayName: 'Attribute',
                    name: 'attribute',
                    values: [
                      {
                        displayName: 'Name',
                        name: 'name',
                        type: 'string',
                        default: '',
                        description: 'Name of the attribute',
                        placeholder: 'e.g. email',
                      },
                      {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                        description: 'Value of the attribute',
                        placeholder: 'e.g. user@example.com',
                      },
                    ],
                  },
                ],
              },
              {
                displayName: 'JSON',
                name: 'json',
                type: 'json',
                default: '{}',
                displayOptions: {
                  show: {
                    inputMethod: ['json'],
                  },
                },
                description: 'Content attributes as JSON object',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Split Message',
        name: 'split_message',
        type: 'boolean',
        default: true,
        description: 'Whether to split the message into multiple messages. Default is double newline (\\n\\n).',
      },
      {
        displayName: 'Split Character',
        name: 'split_character',
        type: 'string',
        default: '\\n\\n',
        placeholder: 'e.g. \\n\\n',
        description: 'Character(s) to split the message on',
        displayOptions: {
          show: {
            split_message: [true],
          },
        },
      },
      {
        displayName: 'Wait Before Sending',
        name: 'wait_before_sending',
        type: 'options',
        default: 'none',
        description: 'Add a delay before sending the message. When splitting, applies to each message.',
        options: [
          {
            name: 'No Delay',
            value: 'none',
          },
          {
            name: 'Fixed Time',
            value: 'fixed',
            description: 'Wait a fixed amount of time between each message',
          },
          {
            name: 'Dynamic (Based on Message Length)',
            value: 'dynamic',
            description: 'Wait time calculated from message length (max 12s)',
          },
        ],
      },
      {
        displayName: 'Wait Time (Seconds)',
        name: 'wait_time_seconds',
        type: 'number',
        default: 5,
        description: 'Fixed time to wait before sending, in seconds (5s default)',
        typeOptions: {
          minValue: 0,
          maxValue: 60,
        },
        displayOptions: {
          show: {
            wait_before_sending: ['fixed'],
          },
        },
      },
      {
        displayName: 'Show Typing While Waiting',
        name: 'typing_while_waiting',
        type: 'boolean',
        default: true,
        description: 'Whether to show typing indicator while waiting before sending the message',
        displayOptions: {
          show: {
            wait_before_sending: ['fixed', 'dynamic'],
          },
        },
      },
    ],
  },
];

const sendFileFields: INodeProperties[] = [
  {
    displayName: 'Input Data Field Name',
    name: 'binaryPropertyName',
    type: 'string',
    default: 'data',
    required: true,
    placeholder: 'e.g. data',
    hint: 'The name of the input field containing the binary file data to be uploaded',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['sendFile'],
      },
    },
  },
  {
    displayName: 'Is Recorded Audio (PTT)',
    name: 'isRecordedAudio',
    type: 'boolean',
    default: false,
    description: 'Whether this is a recorded audio message (Push-To-Talk on WhatsApp). When enabled, shows "recording" indicator instead of "typing".',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['sendFile'],
      },
    },
  },
  {
    displayName: 'Caption',
    name: 'fileCaption',
    type: 'string',
    default: '',
    description: 'Caption/content for the file message. Ignored for audio files.',
    typeOptions: {
      rows: 2,
    },
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['sendFile'],
        isRecordedAudio: [false],
      },
    },
  },
  {
    displayName: 'Options',
    name: 'sendFileOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['sendFile'],
      },
    },
    options: [
      {
        displayName: 'Attachment Metadata',
        name: 'attachments_metadata',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        description: 'Custom metadata to attach to the file (e.g., transcribed_text, image_description)',
        options: [
          {
            name: 'metadata',
            displayName: 'Metadata',
            values: [
              {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                placeholder: 'e.g., transcribed_text',
                description: 'The metadata key (e.g., transcribed_text, image_description)',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'The metadata value',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Private Note',
        name: 'private',
        type: 'boolean',
        default: false,
        description: 'Whether this is a private note (not visible to customer)',
      },
      {
        displayName: 'Show Status While Waiting',
        name: 'status_while_waiting',
        type: 'boolean',
        default: true,
        description: 'Whether to show typing/recording indicator while waiting before sending',
        displayOptions: {
          show: {
            wait_before_sending: ['fixed'],
          },
        },
      },
      {
        displayName: 'Wait Before Sending',
        name: 'wait_before_sending',
        type: 'options',
        default: 'none',
        description: 'Add a delay before sending the file',
        options: [
          {
            name: 'No Delay',
            value: 'none',
          },
          {
            name: 'Fixed Time',
            value: 'fixed',
            description: 'Wait a fixed amount of time before sending',
          },
        ],
      },
      {
        displayName: 'Wait Time (Seconds)',
        name: 'wait_time_seconds',
        type: 'number',
        default: 5,
        description: 'Time to wait before sending, in seconds (5s default)',
        typeOptions: {
          minValue: 0,
          maxValue: 60,
        },
        displayOptions: {
          show: {
            wait_before_sending: ['fixed'],
          },
        },
      },
    ],
  },
];

const sendTemplateFields: INodeProperties[] = [
  {
    ...inboxSelector,
    description: 'Select the inbox to fetch templates from (must be a WhatsApp inbox)',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['sendTemplate'],
      },
    },
  },
  {
    ...messageTemplateSelector,
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['sendTemplate'],
      },
    },
  },
  {
    displayName: 'Template Structure',
    name: 'templatePreview',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'View the structure of the selected template. This field is informational only and does not affect the message.',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['sendTemplate'],
      },
    },
    modes: [
      {
        displayName: 'From Template',
        name: 'list',
        type: 'list',
        typeOptions: {
          searchListMethod: 'searchTemplateStructure',
          searchable: false,
        },
      },
    ],
  },
  {
    displayName: 'Components',
    name: 'components',
    type: 'fixedCollection',
    default: {},
    typeOptions: {
      multipleValues: true,
    },
    placeholder: 'Add Component',
    description: 'Template components with dynamic parameters. Add components matching your template structure.',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['sendTemplate'],
      },
    },
    options: [
      {
        name: 'component',
        displayName: 'Component',
        // eslint-disable-next-line n8n-nodes-base/node-param-fixed-collection-type-unsorted-items
        values: [
          {
            displayName: 'Type',
            name: 'type',
            type: 'options',
            options: [
              { name: 'Body', value: 'body' },
              { name: 'Header', value: 'header' },
              { name: 'Button', value: 'button' },
            ],
            default: 'body',
          },
          // Body parameters
          {
            displayName: 'Parameters',
            name: 'bodyParameters',
            type: 'fixedCollection',
            typeOptions: {
              sortable: true,
              multipleValues: true,
            },
            displayOptions: {
              show: {
                type: ['body'],
              },
            },
            placeholder: 'Add Parameter',
            default: {},
            options: [
              {
                displayName: 'Parameter',
                name: 'parameter',
                values: [
                  {
                    displayName: 'Type',
                    name: 'type',
                    type: 'options',
                    options: [
                      { name: 'Text', value: 'text' },
                      { name: 'Date Time', value: 'date_time' },
                    ],
                    default: 'text',
                  },
                  {
                    displayName: 'Text',
                    name: 'text',
                    type: 'string',
                    displayOptions: {
                      show: {
                        type: ['text'],
                      },
                    },
                    default: '',
                    description: 'Text value for the parameter',
                  },
                  {
                    displayName: 'Date Time',
                    name: 'date_time',
                    type: 'dateTime',
                    displayOptions: {
                      show: {
                        type: ['date_time'],
                      },
                    },
                    default: '',
                    description: 'Date/time value for the parameter',
                  },
                ],
              },
            ],
          },
          // Header parameters
          {
            displayName: 'Parameters',
            name: 'headerParameters',
            type: 'fixedCollection',
            typeOptions: {
              sortable: true,
              multipleValues: true,
            },
            displayOptions: {
              show: {
                type: ['header'],
              },
            },
            placeholder: 'Add Parameter',
            default: {},
            options: [
              {
                displayName: 'Parameter',
                name: 'parameter',
                values: [
                  {
                    displayName: 'Type',
                    name: 'type',
                    type: 'options',
                    options: [
                      { name: 'Text', value: 'text' },
                      { name: 'Image', value: 'image' },
                      { name: 'Video', value: 'video' },
                      { name: 'Document', value: 'document' },
                    ],
                    default: 'text',
                  },
                  {
                    displayName: 'Text',
                    name: 'text',
                    type: 'string',
                    displayOptions: {
                      show: {
                        type: ['text'],
                      },
                    },
                    default: '',
                    description: 'Text value for the parameter',
                  },
                  {
                    displayName: 'Media URL',
                    name: 'mediaUrl',
                    type: 'string',
                    displayOptions: {
                      show: {
                        type: ['image', 'video', 'document'],
                      },
                    },
                    default: '',
                    description: 'URL of the media file',
                  },
                ],
              },
            ],
          },
          // Button fields
          {
            displayName: 'Button Type',
            name: 'sub_type',
            type: 'options',
            displayOptions: {
              show: {
                type: ['button'],
              },
            },
            options: [
              { name: 'Quick Reply', value: 'quick_reply', description: 'Quick reply button with payload' },
              { name: 'URL', value: 'url', description: 'URL button with dynamic suffix' },
              { name: 'Copy Code', value: 'copy_code', description: 'Copy code button' },
            ],
            default: 'quick_reply',
          },
          {
            displayName: 'Button Index',
            name: 'index',
            type: 'number',
            displayOptions: {
              show: {
                type: ['button'],
              },
            },
            typeOptions: {
              minValue: 0,
              maxValue: 9,
            },
            default: 0,
            description: 'Index of the button (0-based, in order they appear in the template)',
          },
          {
            displayName: 'Payload / Parameter',
            name: 'buttonParameter',
            type: 'string',
            displayOptions: {
              show: {
                type: ['button'],
              },
            },
            default: '',
            description: 'For quick_reply: the payload. For URL: the dynamic suffix. For copy_code: the code to copy.',
          },
        ],
      },
    ],
  },
];

const updateAttachmentMetaFields: INodeProperties[] = [
  {
    displayName: 'Message',
    name: 'messageId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    description: 'The message containing the attachment',
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a message...',
        typeOptions: {
          searchListMethod: 'searchMessages',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: '12345',
        validation: [{ type: 'regex', properties: { regex: '^[0-9]+$', errorMessage: 'Must be a number' } }],
      },
    ],
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['updateAttachmentMeta'],
      },
    },
  },
  {
    displayName: 'Attachment',
    name: 'attachmentId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    description: 'The attachment to update',
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select an attachment...',
        typeOptions: {
          searchListMethod: 'searchAttachments',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: '12345',
        validation: [{ type: 'regex', properties: { regex: '^[0-9]+$', errorMessage: 'Must be a number' } }],
      },
    ],
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['updateAttachmentMeta'],
      },
    },
  },
  {
    displayName: 'Metadata',
    name: 'attachmentMeta',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    required: true,
    description: 'Metadata to set on the attachment',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['updateAttachmentMeta'],
      },
    },
    options: [
      {
        name: 'metadata',
        displayName: 'Metadata',
        values: [
          {
            displayName: 'Key',
            name: 'key',
            type: 'string',
            default: '',
            placeholder: 'e.g., transcribed_text',
            description: 'The metadata key (e.g., transcribed_text, image_description)',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description: 'The metadata value',
          },
        ],
      },
    ],
  },
];

const listAttachmentsFields: INodeProperties[] = [];

const deleteMessageFields: INodeProperties[] = [
  {
    displayName: 'Message',
    name: 'messageId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    description: 'The message to delete',
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a message...',
        typeOptions: {
          searchListMethod: 'searchMessages',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: '12345',
        validation: [{ type: 'regex', properties: { regex: '^[0-9]+$', errorMessage: 'Must be a number' } }],
      },
    ],
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['deleteMessage'],
      },
    },
  },
];

const downloadAttachmentFields: INodeProperties[] = [
  {
    displayName: 'Download Mode',
    name: 'downloadMode',
    type: 'options',
    default: 'byId',
    options: [
      { name: 'By Attachment ID', value: 'byId' },
      { name: 'By URL', value: 'byUrl' },
    ],
    description: 'How to identify the attachment to download',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['downloadAttachment'],
      },
    },
  },
  {
    ...accountSelector,
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['downloadAttachment'],
        downloadMode: ['byId'],
      },
    },
  },
  {
    ...inboxSelector,
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['downloadAttachment'],
        downloadMode: ['byId'],
      },
    },
  },
  {
    ...conversationSelector,
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['downloadAttachment'],
        downloadMode: ['byId'],
      },
    },
  },
  {
    displayName: 'Attachment',
    name: 'attachmentId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    description: 'The attachment to download',
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select an attachment...',
        typeOptions: {
          searchListMethod: 'searchAttachments',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: '12345',
        validation: [{ type: 'regex', properties: { regex: '^[0-9]+$', errorMessage: 'Must be a number' } }],
      },
    ],
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['downloadAttachment'],
        downloadMode: ['byId'],
      },
    },
  },
  {
    displayName: 'Attachment URL',
    name: 'attachmentUrl',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'https://...',
    description: 'The direct URL of the attachment to download',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['downloadAttachment'],
        downloadMode: ['byUrl'],
      },
    },
  },
  {
    displayName: 'Allow External URLs',
    name: 'allowExternalUrls',
    type: 'boolean',
    default: false,
    description: 'Whether to allow downloading from URLs outside the configured Chatwoot instance. Enable with caution as this could expose the workflow to untrusted content.',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['downloadAttachment'],
        downloadMode: ['byUrl'],
      },
    },
  },
  {
    displayName: 'Output Binary Property',
    name: 'binaryPropertyName',
    type: 'string',
    default: 'data',
    required: true,
    description: 'Name of the binary property to write the attachment data to',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['downloadAttachment'],
      },
    },
  },
];

const listMessagesFields: INodeProperties[] = [
  {
    displayName: 'Fetch At Least',
    name: 'fetchAtLeast',
    type: 'number',
    default: 20,
    description: 'Minimum number of messages to fetch. Will keep paginating until this count is reached or no more messages are available.',
    typeOptions: {
      minValue: 1,
    },
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['listMessages'],
      },
    },
  },
  {
    displayName: 'Options',
    name: 'listMessagesOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['listMessages'],
      },
    },
    options: [
      {
        displayName: 'Before Message',
        name: 'before',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        description: 'Fetch messages before this message (for pagination)',
        modes: [
          {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            typeOptions: {
              searchListMethod: 'searchMessages',
              searchable: true,
            },
          },
          {
            displayName: 'By ID',
            name: 'id',
            type: 'string',
            placeholder: 'e.g. 12345',
            validation: [
              {
                type: 'regex',
                properties: {
                  regex: '^[0-9]+$',
                  errorMessage: 'Message ID must be a number',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export const conversationDescription: INodeProperties[] = [
  ...conversationOperations,
  ...conversationFields,
  ...updatePresenceFields,
  ...sendFileFields,
  ...sendTemplateFields,
  ...updateAttachmentMetaFields,
  ...listAttachmentsFields,
  ...deleteMessageFields,
  ...downloadAttachmentFields,
  ...listMessagesFields,
];

export { executeConversationOperation } from './operations';
