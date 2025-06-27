import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  // BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  // ListIcon,
  // PageIcon,
  // PieChartIcon,
  // PlugInIcon,
  // TableIcon,
  AccountChildInvert,
  UserCircleIcon,
  GroupIcon,
  Groups,
  ManageAccounts,
  SupervisorAccount,
  Scoreboard,
  AutoStories,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

// Tipe navigasi
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  // subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  subItems?: { name: string; path: string; icon: React.ReactNode; pro?: boolean; new?: boolean }[];
};

// Menu berdasarkan role
const adminNavItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <AutoStories />, name: "Mata Kuliah", path: "/matakuliah" },
  {
    icon: <ManageAccounts />,
    name: "Setting",
    subItems: [
      { icon: <AccountChildInvert />, name: "Mahasiswa", path: "/mahasiswa" },
      { icon: <SupervisorAccount />, name: "Dosen", path: "/dosen" },
      { icon: <UserCircleIcon />, name: "AsDos", path: "/asdos" },
    ],
  },
  // { icon: <AccountChildInvert />, name: "Mahasiswa", path: "/mahasiswa" },
  // { icon: <UserCircleIcon />, name: "Dosen", path: "/dosen" },
  // { icon: <UserCircleIcon />, name: "AsDos", path: "/asdos" },
  { icon: <GroupIcon/>, name: "Pengelompokan", path: "/pengelompokan" },
];

const asdosNavItems: NavItem[] = [
  { icon: <CalenderIcon />, name: "Mata Kuliah", path: "/matakuliah-asdos" },
  { icon: <GroupIcon />, name: "Pengelompokan", path: "/pengelompokan-asdos" },
];



const mahasiswaNavItems: NavItem[] = [
  { icon: <Scoreboard />, name: "Penilaian", path: "/penilaian" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;
  // Ambil role dari localStorage
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : {};
  const userRole = userData?.role || "mahasiswa";
  const userId = userData?.id || null;
  const navItems =
    userRole === "dosen"
      ? adminNavItems
      : userRole === "asdos"
      ? asdosNavItems
      : mahasiswaNavItems;

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;

    ["main"].forEach((menuType) => {
      const items = navItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main", index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
  //   <ul className="flex flex-col gap-4">{/* gap-1 */}
  //     {items.map((nav, index) => (
  //       <li key={nav.name}>
  //         {nav.subItems ? (
  //           <button
  //             onClick={() => handleSubmenuToggle(index, menuType)}
  //             className={`menu-item group ${
  //               openSubmenu?.type === menuType && openSubmenu?.index === index
  //                 ? "menu-item-active"
  //                 : "menu-item-inactive"
  //             } cursor-pointer ${
  //               !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
  //             }`}
  //           >
  //             <span
  //               className={`menu-item-icon-size  ${
  //                 openSubmenu?.type === menuType && openSubmenu?.index === index
  //                   ? "menu-item-icon-active"
  //                   : "menu-item-icon-inactive"
  //               }`}
  //             >
  //               {nav.icon}
  //             </span>
  //             {(isExpanded || isHovered || isMobileOpen) && (
  //               <span className="menu-item-text">{nav.name}</span>
  //             )}
  //             {(isExpanded || isHovered || isMobileOpen) && (
  //               <ChevronDownIcon
  //                 className={`ml-auto w-5 h-5 transition-transform duration-200 ${
  //                   openSubmenu?.type === menuType && openSubmenu?.index === index
  //                     ? "rotate-180 text-brand-500"
  //                     : ""
  //                 }`}
  //               />
  //             )}
  //           </button>
  //         ) : (
  //           nav.path && (
  //             <Link
  //               to={nav.path}
  //               className={`menu-item group ${
  //                 isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
  //               }`}
  //             >
  //               <span
  //                 className={`menu-item-icon-size ${
  //                   isActive(nav.path)
  //                     ? "menu-item-icon-active"
  //                     : "menu-item-icon-inactive"
  //                 }`}
  //               >
  //                 {nav.icon}
  //               </span>
  //               {(isExpanded || isHovered || isMobileOpen) && (
  //                 <span className="menu-item-text">{nav.name}</span>
  //               )}
  //             </Link>
  //           )
  //         )}
  //       </li>
  //     ))}
  //   </ul>
  // );

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
  <ul className="flex flex-col gap-4">
    {items.map((nav, index) => {
      const key = `${menuType}-${index}`;
      // ► sub-menu dianggap tertutup kalau sidebar benar-benar collapsed
      const isSubOpen =
        openSubmenu?.type === menuType && openSubmenu?.index === index;

      return (
        <li key={nav.name}>
          {/* ► TOMBOL UTAMA */}
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                isSubOpen ? "menu-item-active" : "menu-item-inactive"
              } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`menu-item-icon-size ${
                isSubOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"
              }`}>
                {nav.icon}
              </span>

              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="menu-item-text">{nav.name}</span>
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      isSubOpen ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                </>
              )}
            </button>
          ) : (
            /* ► ITEM BIASA */
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {/* ► DAFTAR SUB-ITEM  */}
          {nav.subItems && (
            <div
              // ref={(el) => (subMenuRefs.current[key] = el)}
              ref={(el) => { subMenuRefs.current[key] = el; }}
              // className="overflow-hidden transition-[height] duration-300"
              className={`overflow-hidden transition-[height] duration-300 ${
                isCollapsed ? "hidden" : ""
              }`}
              style={{ height: isSubOpen ? subMenuHeight[key] ?? "auto" : 0 }}
            >
              <ul className="mt-2 ml-9 flex flex-col gap-2">
                {nav.subItems.map((sub) => (
                  <li key={sub.name}>
                    {/* <Link
                      to={sub.path}
                      className={`submenu-item block px-2 py-1 rounded ${
                        isActive(sub.path)
                          ? "bg-brand-50 text-brand-600 font-medium"
                          : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {sub.name}
                    </Link> */}
                    <Link
                      to={sub.path}
                      className={`submenu-item flex items-center gap-3 px-2 py-1 rounded
                        ${isActive(sub.path)
                          ? "bg-brand-50 text-brand-600 font-medium"
                          : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    >
                      {/* ► ICON SUBMENU */}
                      <span className="submenu-item-icon-size">{sub.icon}</span>

                      {/* ► TEKS SUBMENU */}
                      <span>{sub.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      );
    })}
  </ul>
);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
