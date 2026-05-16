export interface Page {
  kind: string;
  data: PageData;
}

export interface PageData {
  content_md: string;
  may_revise: boolean;
  reason: string;
  revision_date: number;
  revision_by: RevisionBy;
  revision_id: string;
  content_html: string;
}

export interface RevisionBy {
  kind: string;
  data: RevisionByData;
}

export interface RevisionByData {
  is_employee: boolean;
  is_friend: boolean;
  subreddit: Subreddit;
  snoovatar_size: null;
  id: string;
  verified: boolean;
  is_gold: boolean;
  is_mod: boolean;
  has_verified_email: boolean;
  icon_img: string;
  hide_from_robots: boolean;
  link_karma: number;
  pref_show_snoovatar: boolean;
  is_blocked: boolean;
  accept_chats: boolean;
  name: string;
  created: number;
  created_utc: number;
  snoovatar_img: string;
  comment_karma: number;
  accept_followers: boolean;
  has_subscribed: boolean;
  accept_pms: boolean;
}

export interface Subreddit {
  default_set: boolean;
  user_is_contributor: boolean;
  banner_img: string;
  allowed_media_in_comments: any[];
  user_is_banned: boolean;
  free_form_reports: boolean;
  community_icon: null;
  show_media: boolean;
  icon_color: string;
  user_is_muted: null;
  display_name: string;
  header_img: null;
  title: string;
  previous_names: any[];
  over_18: boolean;
  icon_size: number[];
  primary_color: string;
  icon_img: string;
  description: string;
  submit_link_label: string;
  header_size: null;
  restrict_posting: boolean;
  restrict_commenting: boolean;
  subscribers: number;
  submit_text_label: string;
  is_default_icon: boolean;
  link_flair_position: string;
  display_name_prefixed: string;
  key_color: string;
  name: string;
  is_default_banner: boolean;
  url: string;
  quarantine: boolean;
  banner_size: null;
  user_is_moderator: boolean;
  accept_followers: boolean;
  public_description: string;
  link_flair_enabled: boolean;
  disable_contributor_requests: boolean;
  subreddit_type: string;
  user_is_subscriber: boolean;
}
