type TemplateType = {
  LINK_TO_ISSUE: string;
  ISSUE: string;
  LINK_TO_COMMIT: string;
  COMMIT: string;
  HEADER: string;
  SECTION_HEADER: string;
  COMPONENT_TITLE: string;
  COMPONENT_ITEM: string;
  COMPONENT_ITEM_CONTINUATION_PREFIX: string;
  COMPONENT_LINE: string;
  COMMIT_ADDITIONAL_INFO: string;
};

export const template: TemplateType = {
  LINK_TO_ISSUE: '[#%s](%s%s)',
  ISSUE: '#%s',
  LINK_TO_COMMIT: '[%s](%s%s)',
  COMMIT: '%s',
  HEADER: '# %s (%s/%s/%s)\n',
  SECTION_HEADER: '## %s\n',
  COMPONENT_TITLE: '- **%s:**',
  COMPONENT_ITEM: '  -',
  COMPONENT_ITEM_CONTINUATION_PREFIX: '  ',
  COMPONENT_LINE: '%s %s',
  COMMIT_ADDITIONAL_INFO: '  (%s)',
};
