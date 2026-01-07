'use client'

import React, { useState } from "react";

import NavLinks from "../NavLinks"
import ThemeToggleButton from "../ThemeToggleButton"
import ToggleableSideBar from "@/common/components/SideBar";
import { Theme } from "@/common/enums/theme";

type SideBarProps = {
    theme: Theme;
}

const SideBar: React.FC<SideBarProps> = ({ theme }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onHamburgerClick = () => {
        setIsOpen(true);
    }

    const closeSideBar = () => setIsOpen(false)

    return (
        <ToggleableSideBar isOpen={isOpen} onHamburgerClick={onHamburgerClick} onCloseClick={closeSideBar}>
          <div className="flex flex-col h-full">
            <NavLinks aftertLinkClick={closeSideBar} className='flex-col items-start py-6'/>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Theme</span>
                <ThemeToggleButton theme={theme} />
              </div>
            </div>
          </div>
        </ToggleableSideBar>
    )
}

export default SideBar;