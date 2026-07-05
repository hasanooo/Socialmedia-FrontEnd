import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import { useFeedHub } from '../hooks/useFeedHub';
import { PostComposer } from '../components/PostComposer';
import { PostCard } from '../components/PostCard';

const suggestedPeople = [
  { name: 'Steve Jobs', title: 'CEO of Apple', image: '/assets/images/people1.png' },
  { name: 'Ryan Roslansky', title: 'CEO of Linkedin', image: '/assets/images/people2.png' },
  { name: 'Dylan Field', title: 'CEO of Figma', image: '/assets/images/people3.png' },
];

const notifications = [
  { text: 'Steve Jobs posted a link in your timeline.', time: '42 minutes ago', image: '/assets/images/friend-req.png' },
  { text: 'Ryan Roslansky commented on your post.', time: '1 hour ago', image: '/assets/images/profile-1.png' },
  { text: 'Dylan Field liked your photo.', time: '3 hours ago', image: '/assets/images/friend-req.png' },
];

const friends = [
  { name: 'Steve Jobs', title: 'CEO of Apple', image: '/assets/images/people1.png', online: false },
  { name: 'Ryan Roslansky', title: 'CEO of Linkedin', image: '/assets/images/people2.png', online: true },
  { name: 'Dylan Field', title: 'CEO of Figma', image: '/assets/images/people3.png', online: true },
];

export function FeedPage() {
  const { user, logout } = useAuth();
  useFeedHub(user?.id);

  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const query = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => postsApi.getFeed(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });

  const posts = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className={`_layout _layout_main_wrapper ${darkMode ? '_dark_wrapper' : ''}`}>
      <div className="_layout_mode_swithing_btn">
        <button type="button" onClick={() => setDarkMode((d) => !d)} className="_layout_swithing_btn_link">
          <div className="_layout_swithing_btn">
            <div className="_layout_swithing_btn_round" />
          </div>
          <div className="_layout_change_btn_ic1">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" fill="none" viewBox="0 0 11 16">
              <path
                fill="#fff"
                d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1z"
              />
            </svg>
          </div>
          <div className="_layout_change_btn_ic2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4.389" stroke="#fff" transform="rotate(-90 12 12)" />
              <path
                stroke="#fff"
                strokeLinecap="round"
                d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05"
              />
            </svg>
          </div>
        </button>
      </div>

      <div className="_main_layout">
        <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
          <div className="container _custom_container">
            <div className="_logo_wrap">
              <span className="navbar-brand">
                <img src="/assets/images/logo.svg" alt="Image" className="_nav_logo" />
              </span>
            </div>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <div className="_header_form ms-auto">
                <form className="_header_form_grp" onSubmit={(e) => e.preventDefault()}>
                  <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                    <circle cx="7" cy="7" r="6" stroke="#666" />
                    <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                  </svg>
                  <input className="form-control me-2 _inpt1" type="search" placeholder="input search text" aria-label="Search" />
                </form>
              </div>
              <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
                <li className="nav-item _header_nav_item">
                  <span className="nav-link _header_nav_link_active _header_nav_link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21">
                      <path
                        className="_home_active"
                        stroke="#000"
                        strokeWidth="1.5"
                        strokeOpacity=".6"
                        d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z"
                      />
                      <path
                        className="_home_active"
                        stroke="#000"
                        strokeOpacity=".6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857"
                      />
                    </svg>
                  </span>
                </li>
                <li className="nav-item _header_nav_item">
                  <span id="_notify_btn" onClick={() => setNotifOpen((v) => !v)} className="nav-link _header_nav_link _header_notify_btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                      <path
                        fill="#000"
                        fillOpacity=".6"
                        fillRule="evenodd"
                        d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="_counting">{notifications.length}</span>
                    <div className={`_notification_dropdown ${notifOpen ? 'show' : ''}`}>
                      <div className="_notifications_content">
                        <h4 className="_notifications_content_title">Notifications</h4>
                      </div>
                      <div className="_notifications_drop_box">
                        <div className="_notifications_all">
                          {notifications.map((n, i) => (
                            <div className="_notification_box" key={i}>
                              <div className="_notification_image">
                                <img src={n.image} alt="Image" className="_notify_img" />
                              </div>
                              <div className="_notification_txt">
                                <p className="_notification_para">{n.text}</p>
                                <div className="_nitification_time">
                                  <span>{n.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </span>
                </li>
              </ul>
              <div className="_header_nav_profile">
                <div className="_header_nav_profile_image">
                  <img src="/assets/images/profile.png" alt="Image" className="_nav_profile_img" />
                </div>
                <div className="_header_nav_dropdown">
                  <p className="_header_nav_para">{user?.fullName}</p>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="_header_nav_dropdown_btn _dropdown_toggle"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                      <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                    </svg>
                  </button>
                </div>
                <div className={`_nav_profile_dropdown _profile_dropdown ${profileOpen ? 'show' : ''}`}>
                  <div className="_nav_profile_dropdown_info">
                    <div className="_nav_profile_dropdown_image">
                      <img src="/assets/images/profile.png" alt="Image" className="_nav_drop_img" />
                    </div>
                    <div className="_nav_profile_dropdown_info_txt">
                      <h4 className="_nav_dropdown_title">{user?.fullName}</h4>
                      <span className="_nav_drop_profile">{user?.email}</span>
                    </div>
                  </div>
                  <hr />
                  <ul className="_nav_dropdown_list">
                    <li className="_nav_dropdown_list_item">
                      <span className="_nav_dropdown_link">
                        <div className="_nav_drop_info">Settings</div>
                      </span>
                    </li>
                    <li className="_nav_dropdown_list_item">
                      <span className="_nav_dropdown_link">
                        <div className="_nav_drop_info">Help &amp; Support</div>
                      </span>
                    </li>
                    <li className="_nav_dropdown_list_item">
                      <button type="button" onClick={() => logout()} className="_nav_dropdown_link w-100 text-start border-0 bg-transparent">
                        <div className="_nav_drop_info">Log Out</div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_left_sidebar_wrap">
                  <div className="_layout_left_sidebar_inner">
                    <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_left_inner_area_suggest_content _mar_b24">
                        <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
                      </div>
                      {suggestedPeople.map((p) => (
                        <div className="_left_inner_area_suggest_info" key={p.name}>
                          <div className="_left_inner_area_suggest_info_box">
                            <div className="_left_inner_area_suggest_info_image">
                              <img src={p.image} alt="Image" className="_info_img" />
                            </div>
                            <div className="_left_inner_area_suggest_info_txt">
                              <h4 className="_left_inner_area_suggest_info_title">{p.name}</h4>
                              <p className="_left_inner_area_suggest_info_para">{p.title}</p>
                            </div>
                          </div>
                          <div className="_left_inner_area_suggest_info_link">
                            <span className="_info_link">Connect</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <PostComposer />

                    {query.isLoading && <p className="text-center">Loading feed...</p>}
                    {!query.isLoading && posts.length === 0 && (
                      <p className="text-center">No posts yet. Be the first to share something!</p>
                    )}

                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} currentUserId={user?.id} />
                    ))}

                    {query.hasNextPage && (
                      <div className="text-center _mar_b16">
                        <button
                          type="button"
                          onClick={() => query.fetchNextPage()}
                          disabled={query.isFetchingNextPage}
                          className="_social_login_form_btn_link _btn1"
                        >
                          {query.isFetchingNextPage ? 'Loading...' : 'Load more'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_right_sidebar_wrap">
                  <div className="_layout_right_sidebar_inner">
                    <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_feed_top_fixed">
                        <div className="_feed_right_inner_area_card_content _mar_b24">
                          <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                        </div>
                      </div>
                      <div className="_feed_bottom_fixed">
                        {friends.map((f) => (
                          <div className={`_feed_right_inner_area_card_ppl ${!f.online ? '_feed_right_inner_area_card_ppl_inactive' : ''}`} key={f.name}>
                            <div className="_feed_right_inner_area_card_ppl_box">
                              <div className="_feed_right_inner_area_card_ppl_image">
                                <img src={f.image} alt="" className="_box_ppl_img" />
                              </div>
                              <div className="_feed_right_inner_area_card_ppl_txt">
                                <h4 className="_feed_right_inner_area_card_ppl_title">{f.name}</h4>
                                <p className="_feed_right_inner_area_card_ppl_para">{f.title}</p>
                              </div>
                            </div>
                            <div className="_feed_right_inner_area_card_ppl_side">
                              {f.online ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                                  <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                                </svg>
                              ) : (
                                <span>Offline</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
