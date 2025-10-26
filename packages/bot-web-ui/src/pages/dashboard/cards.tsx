//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import GoogleDrive from '@/components/load-modal/google-drive';
import Dialog from '@/components/shared_ui/dialog';
import MobileFullPageModal from '@/components/shared_ui/mobile-full-page-modal';
import Text from '@/components/shared_ui/text';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import {
    DerivLightBotBuilderIcon,
    DerivLightGoogleDriveIcon,
    DerivLightLocalDeviceIcon,
    DerivLightMyComputerIcon,
    DerivLightQuickStrategyIcon,
} from '@deriv/quill-icons/Illustration';
import { Localize, localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { rudderStackSendOpenEvent } from '../../analytics/rudderstack-common-events';
import { rudderStackSendDashboardClickEvent } from '../../analytics/rudderstack-dashboard';
import DashboardBotList from './bot-list/dashboard-bot-list';

type TCardProps = {
    has_dashboard_strategies: boolean;
    is_mobile: boolean;
};

type TCardArray = {
    id: string;
    icon: React.ReactElement;
    content: React.ReactElement;
    callback: () => void;
    gradient: string;
    glowColor: string;
};

const Cards = observer(({ is_mobile, has_dashboard_strategies }: TCardProps) => {
    const { dashboard, load_modal, quick_strategy } = useStore();
    const { toggleLoadModal, setActiveTabIndex } = load_modal;
    const { isDesktop } = useDevice();
    const { onCloseDialog, dialog_options, is_dialog_open, setActiveTab, setPreviewOnPopup } = dashboard;
    const { setFormVisibility } = quick_strategy;

    const openGoogleDriveDialog = () => {
        toggleLoadModal();
        setActiveTabIndex(is_mobile ? 1 : 2);
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const openFileLoader = () => {
        toggleLoadModal();
        setActiveTabIndex(is_mobile ? 0 : 1);
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const actions: TCardArray[] = [
        {
            id: 'my-computer',
            icon: is_mobile ? (
                <DerivLightLocalDeviceIcon height='48px' width='48px' />
            ) : (
                <DerivLightMyComputerIcon height='48px' width='48px' />
            ),
            content: is_mobile ? <Localize i18n_default_text='Local' /> : <Localize i18n_default_text='My computer' />,
            callback: () => {
                openFileLoader();
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'load_strategy',
                    load_strategy_tab: 'local',
                });
            },
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            glowColor: 'rgba(102, 126, 234, 0.6)'
        },
        {
            id: 'google-drive',
            icon: <DerivLightGoogleDriveIcon height='48px' width='48px' />,
            content: <Localize i18n_default_text='Google Drive' />,
            callback: () => {
                openGoogleDriveDialog();
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'load_strategy',
                    load_strategy_tab: 'google drive',
                });
            },
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            glowColor: 'rgba(240, 147, 251, 0.6)'
        },
        {
            id: 'bot-builder',
            icon: <DerivLightBotBuilderIcon height='48px' width='48px' />,
            content: <Localize i18n_default_text='Bot builder' />,
            callback: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                rudderStackSendDashboardClickEvent({
                    dashboard_click_name: 'bot_builder',
                    subpage_name: 'bot_builder',
                });
            },
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            glowColor: 'rgba(79, 172, 254, 0.6)'
        },
        {
            id: 'quick-strategy',
            icon: <DerivLightQuickStrategyIcon height='48px' width='48px' />,
            content: <Localize i18n_default_text='Quick strategy' />,
            callback: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                setFormVisibility(true);
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'quick_strategy',
                });
            },
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            glowColor: 'rgba(67, 233, 123, 0.6)'
        },
    ];

    return React.useMemo(
        () => (
            <div
                className={classNames('tab__dashboard__table', {
                    'tab__dashboard__table--minimized': has_dashboard_strategies && is_mobile,
                })}
            >
                {/* Animated Background Elements */}
                <div className='dashboard-background'>
                    <div className='grid-background'>
                        <div className='grid-lines'></div>
                        <div className='grid-overlay'></div>
                    </div>
                    <div className='particle-effects'>
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className='particle' style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 4}s`
                            }}></div>
                        ))}
                    </div>
                </div>

                <div
                    className={classNames('tab__dashboard__table__tiles', {
                        'tab__dashboard__table__tiles--minimized': has_dashboard_strategies && is_mobile,
                    })}
                    id='tab__dashboard__table__tiles'
                >
                    {actions.map(icons => {
                        const { icon, content, callback, id, gradient, glowColor } = icons;
                        return (
                            <div
                                key={id}
                                className={classNames('tab__dashboard__table__block', {
                                    'tab__dashboard__table__block--minimized': has_dashboard_strategies && is_mobile,
                                    'enhanced-card': true,
                                })}
                                style={{
                                    '--card-gradient': gradient,
                                    '--card-glow': glowColor,
                                } as React.CSSProperties}
                            >
                                <div className='card-glow-effect'></div>
                                <div className='card-shine'></div>
                                <div className='card-pulse'></div>
                                
                                <div
                                    className={classNames('tab__dashboard__table__images enhanced-card-icon', {
                                        'tab__dashboard__table__images--minimized': has_dashboard_strategies,
                                    })}
                                    width='8rem'
                                    height='8rem'
                                    icon={icon}
                                    id={id}
                                    onClick={() => {
                                        callback();
                                    }}
                                >
                                    <div className='icon-wrapper' style={{ background: gradient }}>
                                        {icon}
                                    </div>
                                    <div className='icon-glow'></div>
                                </div>
                                <Text color='prominent' size={is_mobile ? 'xxs' : 'xs'} className='enhanced-card-text'>
                                    <span className='text-glow'>{content}</span>
                                </Text>
                                <div className='card-connection'></div>
                            </div>
                        );
                    })}

                    {!isDesktop ? (
                        <Dialog
                            title={dialog_options.title}
                            is_visible={is_dialog_open}
                            onCancel={onCloseDialog}
                            is_mobile_full_width
                            className='dc-dialog__wrapper--google-drive'
                            has_close_icon
                        >
                            <GoogleDrive />
                        </Dialog>
                    ) : (
                        <MobileFullPageModal
                            is_modal_open={is_dialog_open}
                            className='load-strategy__wrapper'
                            header={localize('Load strategy')}
                            onClickClose={() => {
                                setPreviewOnPopup(false);
                                onCloseDialog();
                            }}
                            height_offset='80px'
                            page_overlay
                        >
                            <div label='Google Drive' className='google-drive-label'>
                                <GoogleDrive />
                            </div>
                        </MobileFullPageModal>
                    )}
                </div>
                <DashboardBotList />
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [is_dialog_open, has_dashboard_strategies]
    );
});

export default Cards;
