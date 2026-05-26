import svgPaths from "./svg-cgx17yfs5v";
import imgPrimaryLogoGrow260X1043 from "../assets/a47dcf28a3997c763da9c73c54846d4fd7deaf00.png";

function FormHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center justify-center not-italic relative shrink-0 w-full" data-name="Form header">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#2e2e2e] text-[24px]">Sign In</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#5a6a76] text-[14px]">Welcome back! Please enter your details</p>
    </div>
  );
}

function PrimaryNumberInput() {
  return (
    <div className="h-[44px] relative rounded-[8px] shrink-0 w-full" data-name="Primary Number Input">
      <div aria-hidden="true" className="absolute border border-[#bdc1c5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2e2e2e] text-[14px]">-</p>
        </div>
      </div>
    </div>
  );
}

function PrimaryNumberContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[69px] items-start relative shrink-0 w-full" data-name="Primary Number Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#5a6a76] text-[14px] w-full whitespace-pre-wrap">Email</p>
      <PrimaryNumberInput />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[12.5%_4.35%]" data-name="Group">
      <div className="absolute inset-[-5.56%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.4324 15">
          <g id="Group">
            <path d="M1.46618 0.75L14.9662 14.25" id="Vector" stroke="var(--stroke-0, #5A6A76)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path clipRule="evenodd" d={svgPaths.p303ccb2} fill="var(--fill-0, #5A6A76)" fillRule="evenodd" id="Vector_2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MajesticonsEyeOff() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]" data-name="majesticons:eye-off">
      <Group />
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="h-[44px] relative rounded-[8px] shrink-0 w-full" data-name="Password Input">
      <div aria-hidden="true" className="absolute border border-[#bdc1c5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2e2e2e] text-[14px]">-</p>
          <MajesticonsEyeOff />
        </div>
      </div>
    </div>
  );
}

function PasswordField() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[69px] items-start relative shrink-0 w-full" data-name="Password Field">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#5a6a76] text-[14px] w-full whitespace-pre-wrap">Password</p>
      <PasswordInput />
    </div>
  );
}

function Check() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="check">
          <rect height="15" rx="3.5" stroke="var(--stroke-0, #BDC1C5)" width="15" x="0.5" y="0.5" />
          <g id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Checkbox() {
  return (
    <div className="content-stretch flex gap-[8px] items-end relative shrink-0" data-name="Checkbox">
      <Check />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2e2e2e] text-[14px]">Remember me</p>
    </div>
  );
}

function CheckboxContainer() {
  return (
    <div className="content-stretch flex items-end justify-between pb-[12px] relative shrink-0 w-full" data-name="Checkbox Container">
      <Checkbox />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2855a6] text-[14px]">Forgot password?</p>
    </div>
  );
}

function SubmitButton() {
  return (
    <div className="bg-[#2855a6] h-[44px] relative rounded-[8px] shrink-0 w-full" data-name="Submit Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-white">Sing in</p>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="content-stretch flex gap-[17px] items-center justify-center relative shrink-0 w-full" data-name="Divider">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 214 1">
            <line id="Line 8" stroke="var(--stroke-0, #E9E9E9)" x2="214" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#5a6a76] text-[14px]">Or</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 214 1">
            <line id="Line 8" stroke="var(--stroke-0, #E9E9E9)" x2="214" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[6.25%_7.74%_6.29%_7.81%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.2683 20.9912">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p35601f00} fill="var(--fill-0, #F44336)" fillRule="evenodd" id="Vector" opacity="0.987" />
          <path clipRule="evenodd" d={svgPaths.p3f39300} fill="var(--fill-0, #FFC107)" fillRule="evenodd" id="Vector_2" opacity="0.997" />
          <path clipRule="evenodd" d={svgPaths.pd1d4200} fill="var(--fill-0, #448AFF)" fillRule="evenodd" id="Vector_3" opacity="0.999" />
          <path clipRule="evenodd" d={svgPaths.p3a074200} fill="var(--fill-0, #43A047)" fillRule="evenodd" id="Vector_4" opacity="0.993" />
        </g>
      </svg>
    </div>
  );
}

function MaterialIconThemeGoogle() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="material-icon-theme:google">
      <Group1 />
    </div>
  );
}

function LegalEntityTypeInput() {
  return (
    <div className="flex-[1_0_0] h-[44px] min-h-px min-w-px relative rounded-[8px]" data-name="Legal entity type input">
      <div aria-hidden="true" className="absolute border border-[#bdc1c5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] relative size-full">
          <MaterialIconThemeGoogle />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2e2e2e] text-[14px]">Sign in with Google</p>
        </div>
      </div>
    </div>
  );
}

function LogosMicrosoftIcon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="logos:microsoft-icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="logos:microsoft-icon">
          <path d="M12 11.5H3V3.5H12V11.5Z" fill="var(--fill-0, #F1511B)" id="Vector" />
          <path d="M22 11.5H13V3.5H22V11.5Z" fill="var(--fill-0, #80CC28)" id="Vector_2" />
          <path d="M12 21.5H3V12.5H12V21.5Z" fill="var(--fill-0, #00ADEF)" id="Vector_3" />
          <path d="M22 21.5H13V12.5H22V21.5Z" fill="var(--fill-0, #FBBC09)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function MicrosoftButtonContainer() {
  return (
    <div className="flex-[1_0_0] h-[44px] min-h-px min-w-px relative rounded-[8px]" data-name="Microsoft Button Container">
      <div aria-hidden="true" className="absolute border border-[#bdc1c5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] relative size-full">
          <LogosMicrosoftIcon />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#2e2e2e] text-[14px]">Sign in with Microsoft</p>
        </div>
      </div>
    </div>
  );
}

function LegalEntityTypeField() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Legal entity type field">
      <LegalEntityTypeInput />
      <MicrosoftButtonContainer />
    </div>
  );
}

function PrivacyLinks() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[8px] items-center justify-center leading-[20px] not-italic relative shrink-0 text-[14px] w-[478px]" data-name="Privacy Links">
      <p className="relative shrink-0 text-[#5a6a76]">Read our</p>
      <p className="relative shrink-0 text-[#2855a6]">Privacy Policy</p>
      <p className="relative shrink-0 text-[#5a6a76]">|</p>
      <p className="relative shrink-0 text-[#2855a6]">{`Trams & Condition`}</p>
    </div>
  );
}

function Form() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Form">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[44px] relative w-full">
        <FormHeader />
        <PrimaryNumberContainer />
        <PasswordField />
        <CheckboxContainer />
        <SubmitButton />
        <Divider />
        <LegalEntityTypeField />
        <PrivacyLinks />
      </div>
    </div>
  );
}

function ProgressIndicator() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Progress indicator">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[44px] items-center p-[44px] relative w-full">
          <div className="h-[64px] relative shrink-0 w-[212px]" data-name="Primary-Logo-grow-260x104 3">
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgPrimaryLogoGrow260X1043} />
          </div>
          <Form />
        </div>
      </div>
    </div>
  );
}

function WelcomeTextSection() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-center left-[44px] not-italic text-center text-white top-[54px] w-[566px]" data-name="Welcome Text Section">
      <div className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[52px] whitespace-nowrap">
        <p className="mb-0">Welcome back!</p>
        <p className="mb-0">{`Please sign in to your `}</p>
        <p>Grow account</p>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-full relative shrink-0 text-[14px] w-[min-content] whitespace-pre-wrap">Lorem ipsum dolor sit amet consectetur. Urna dui quis in ac dignissim habitasse nisl. Pretium risus ultricies mauris posuere penatibus eu semper in.</p>
    </div>
  );
}

function GraphIconGroup() {
  return (
    <div className="absolute bottom-[26.37%] left-[28.13%] right-[26.17%] top-1/4" data-name="Graph Icon Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.1953 20.4258">
        <g id="Graph Icon Group">
          <path d={svgPaths.p1a20bd00} fill="var(--fill-0, #2855A6)" id="Vector" />
          <path d={svgPaths.p3a1ec600} fill="var(--fill-0, #2855A6)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p30215e80} fill="var(--fill-0, #2855A6)" id="Vector_3" opacity="0.7" />
          <path d={svgPaths.p386d1f80} fill="var(--fill-0, #2855A6)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function SolarUsersGroupTwoRoundedBoldDuotone() {
  return (
    <div className="bg-white overflow-clip relative rounded-[8px] shrink-0 size-[42px]" data-name="solar:users-group-two-rounded-bold-duotone">
      <GraphIconGroup />
    </div>
  );
}

function GraphTitleContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 whitespace-pre-wrap" data-name="Graph Title Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#2e2e2e] text-[18px] w-full">Graph and Analysis</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#5a6a76] text-[12px] w-full">{`Project complete per month `}</p>
    </div>
  );
}

function GraphIcon() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Graph Icon">
      <SolarUsersGroupTwoRoundedBoldDuotone />
      <GraphTitleContainer />
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative size-[18px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="chevron-down">
          <path d="M7.5 12L10.5 9L7.5 6" id="Vector" stroke="var(--stroke-0, #5A6A76)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function GraphFilter() {
  return (
    <div className="content-stretch flex gap-[13px] h-[44px] items-center px-[16px] relative rounded-[8px] shrink-0" data-name="Graph Filter">
      <div aria-hidden="true" className="absolute border border-[#bdc1c5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#5a6a76] text-[14px]">Month</p>
      <div className="flex items-center justify-center relative shrink-0 size-[18px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}

function GraphHeader() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Graph Header">
      <GraphIcon />
      <GraphFilter />
    </div>
  );
}

function GraphBarJan() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative" data-name="Graph Bar Jan">
      <div className="bg-[#e9e9e9] h-[132px] rounded-[8px] shrink-0 w-full" data-name="Graph Bar Jan Fill" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full whitespace-pre-wrap">Jan</p>
    </div>
  );
}

function GraphBarFeb() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative" data-name="Graph Bar Feb">
      <div className="bg-[#e9e9e9] h-[115px] rounded-[8px] shrink-0 w-full" data-name="Graph Bar Feb Fill" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full whitespace-pre-wrap">Feb</p>
    </div>
  );
}

function GraphBarMar() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative" data-name="Graph Bar Mar">
      <div className="bg-[#e9e9e9] h-[146px] rounded-[8px] shrink-0 w-full" data-name="Graph Bar Mar Fill" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full whitespace-pre-wrap">Mar</p>
    </div>
  );
}

function GraphBarApr() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative" data-name="Graph Bar Apr">
      <div className="bg-[#2855a6] h-[163px] rounded-[8px] shrink-0 w-full" data-name="Graph Bar Apr Fill" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full whitespace-pre-wrap">Apr</p>
    </div>
  );
}

function GraphBarMay() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative" data-name="Graph Bar May">
      <div className="bg-[#e9e9e9] h-[126px] rounded-[8px] shrink-0 w-full" data-name="Graph Bar May Fill" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full whitespace-pre-wrap">May</p>
    </div>
  );
}

function GraphBarJun() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative" data-name="Graph Bar Jun">
      <div className="bg-[#e9e9e9] h-[158px] rounded-[8px] shrink-0 w-full" data-name="Graph Bar Jun Fill" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full whitespace-pre-wrap">Jun</p>
    </div>
  );
}

function GraphBarJul() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative" data-name="Graph Bar Jul">
      <div className="bg-[#e9e9e9] h-[118px] rounded-[8px] shrink-0 w-full" data-name="Graph Bar Jul Fill" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full whitespace-pre-wrap">Jul</p>
    </div>
  );
}

function GraphBarAug() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative" data-name="Graph Bar Aug">
      <div className="bg-[#e9e9e9] h-[139px] rounded-[8px] shrink-0 w-full" data-name="Graph Bar Aug Fill" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#5a6a76] text-[12px] text-center w-full whitespace-pre-wrap">Aug</p>
    </div>
  );
}

function GraphContent() {
  return (
    <div className="content-stretch flex gap-[24px] h-[200px] items-end justify-center relative shrink-0 w-[484px]" data-name="Graph Content">
      <GraphBarJan />
      <GraphBarFeb />
      <GraphBarMar />
      <GraphBarApr />
      <GraphBarMay />
      <GraphBarJun />
      <GraphBarJul />
      <GraphBarAug />
    </div>
  );
}

function GraphContainer() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start p-[24px] relative rounded-[8px] shrink-0 w-[532px]" data-name="Graph Container">
      <GraphHeader />
      <GraphContent />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[33.28%_18.75%_31.33%_17.38%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4375 11.3268">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p1c79ea00} fill="var(--fill-0, #F5A623)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p39d4f040} fill="var(--fill-0, #F5A623)" fillRule="evenodd" id="Vector_2" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function SolarUsersGroupTwoRoundedBoldDuotone1() {
  return (
    <div className="bg-[#f5f5f5] overflow-clip relative rounded-[8px] shrink-0 size-[32px]" data-name="solar:users-group-two-rounded-bold-duotone">
      <Group2 />
    </div>
  );
}

function TasksIconContainer() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Tasks Icon Container">
      <SolarUsersGroupTwoRoundedBoldDuotone1 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#5a6a76] text-[14px]">Tasks Due</p>
    </div>
  );
}

function MoreVertical() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="more-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="more-vertical">
          <path d={svgPaths.p3f4e600} id="Vector" stroke="var(--stroke-0, #5A6A76)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
          <path d={svgPaths.p2aca4e80} id="Vector_2" stroke="var(--stroke-0, #5A6A76)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
          <path d={svgPaths.p10b1cef0} id="Vector_3" stroke="var(--stroke-0, #5A6A76)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        </g>
      </svg>
    </div>
  );
}

function TasksHeader() {
  return (
    <div className="content-stretch flex items-center justify-between relative rounded-[8px] shrink-0 w-full" data-name="Tasks Header">
      <TasksIconContainer />
      <MoreVertical />
    </div>
  );
}

function TasksBar() {
  return (
    <div className="content-stretch flex gap-[3px] items-end relative shrink-0" data-name="Tasks Bar">
      <div className="bg-[#f5a623] h-[6px] rounded-[7px] shrink-0 w-[4px]" data-name="Tasks Bar Fill" />
      <div className="bg-[#f5a623] h-[22px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 2" />
      <div className="bg-[#f5a623] h-[14px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 3" />
      <div className="bg-[#f5a623] h-[18px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 4" />
      <div className="bg-[#f5a623] h-[23px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 5" />
      <div className="bg-[#f5a623] h-[26px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 6" />
      <div className="bg-[#f5a623] h-[19px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 7" />
      <div className="bg-[#f5a623] h-[22px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 8" />
      <div className="bg-[#f5a623] h-[26px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 9" />
      <div className="bg-[#f5a623] h-[18px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 10" />
      <div className="bg-[#f5a623] h-[24px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 11" />
      <div className="bg-[#f5a623] h-[12px] rounded-[7px] shrink-0 w-[4px]" data-name="Task Bar 12" />
    </div>
  );
}

function ArrowUpRight() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="arrow-up-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="arrow-up-right">
          <path d={svgPaths.p22ad4980} id="Vector" stroke="var(--stroke-0, #F5A623)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p33b0c200} id="Vector_2" stroke="var(--stroke-0, #F5A623)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function TasksProgress() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0" data-name="Tasks Progress">
      <ArrowUpRight />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#f5a623] text-[12px]">20%</p>
    </div>
  );
}

function TasksDataContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-end justify-end relative shrink-0" data-name="Tasks Data Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#2e2e2e] text-[18px]">14</p>
      <TasksProgress />
    </div>
  );
}

function TasksContent() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[8px] shrink-0 w-full" data-name="Tasks Content">
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex items-end justify-between p-[24px] relative w-full">
          <TasksBar />
          <TasksDataContainer />
        </div>
      </div>
    </div>
  );
}

function TasksContainer() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[24px] items-start left-[361px] p-[24px] rounded-[8px] shadow-[-24px_42px_64px_0px_rgba(0,0,0,0.25)] top-[-63.5px] w-[215px]" data-name="Tasks Container">
      <TasksHeader />
      <TasksContent />
    </div>
  );
}

function GraphSection() {
  return (
    <div className="absolute content-stretch flex items-center left-[41px] top-[406px]" data-name="Graph Section">
      <GraphContainer />
      <TasksContainer />
    </div>
  );
}

function WelcomeSection() {
  return (
    <div className="bg-[#2855a6] flex-[1_0_0] h-[803px] min-h-px min-w-px overflow-clip relative rounded-[16px]" data-name="Welcome Section">
      <WelcomeTextSection />
      <GraphSection />
      <div className="absolute flex items-center justify-center left-[12px] size-[271px] top-[-1.5px]">
        <div className="-scale-y-100 flex-none">
          <div className="relative size-[271px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 271 271">
              <g id="Ellipse 3240" opacity="0.3">
                <mask fill="white" id="path-1-inside-1_11_227">
                  <path d={svgPaths.pad75500} />
                </mask>
                <g clipPath="url(#paint0_angular_11_227_clip_path)" data-figma-skip-parse="true" mask="url(#path-1-inside-1_11_227)">
                  <g transform="matrix(0 0.1355 -0.1355 0 135.5 135.5)" />
                </g>
                <path d={svgPaths.p366a1300} data-figma-gradient-fill="{'type':'GRADIENT_ANGULAR','stops':[{'color':{'r':1.0,'g':1.0,'b':1.0,'a':1.0},'position':0.0},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':0.250},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':1.0}],'stopsVar':[{'color':{'r':1.0,'g':1.0,'b':1.0,'a':1.0},'position':0.0},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':0.250},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':1.0}],'transform':{'m00':1.6593966665708927e-14,'m01':-271.00003051757812,'m02':271.00003051757812,'m10':270.99996948242188,'m11':1.6593963277577138e-14,'m12':-1.6593963277577138e-14},'opacity':1.0,'blendMode':'NORMAL','visible':true}" mask="url(#path-1-inside-1_11_227)" />
              </g>
              <defs>
                <clipPath id="paint0_angular_11_227_clip_path">
                  <path d={svgPaths.p366a1300} mask="url(#path-1-inside-1_11_227)" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[529px] size-[245px] top-[714.5px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="relative size-[245px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 245 245">
              <g id="Ellipse 3241" opacity="0.3">
                <mask fill="white" id="path-1-inside-1_11_212">
                  <path d={svgPaths.p29f2e280} />
                </mask>
                <g clipPath="url(#paint0_angular_11_212_clip_path)" data-figma-skip-parse="true" mask="url(#path-1-inside-1_11_212)">
                  <g transform="matrix(0 0.1225 -0.1225 0 122.5 122.5)" />
                </g>
                <path d={svgPaths.p1852b1c0} data-figma-gradient-fill="{'type':'GRADIENT_ANGULAR','stops':[{'color':{'r':1.0,'g':1.0,'b':1.0,'a':1.0},'position':0.0},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':0.250},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':1.0}],'stopsVar':[{'color':{'r':1.0,'g':1.0,'b':1.0,'a':1.0},'position':0.0},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':0.250},{'color':{'r':1.0,'g':1.0,'b':1.0,'a':0.0},'position':1.0}],'transform':{'m00':1.5001924195631212e-14,'m01':-245.00001525878906,'m02':245.00001525878906,'m10':244.99998474121094,'m11':1.5001922501565318e-14,'m12':-1.5001922501565318e-14},'opacity':1.0,'blendMode':'NORMAL','visible':true}" mask="url(#path-1-inside-1_11_212)" />
              </g>
              <defs>
                <clipPath id="paint0_angular_11_212_clip_path">
                  <path d={svgPaths.p1852b1c0} mask="url(#path-1-inside-1_11_212)" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#f5f5f5] flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[44px] items-center p-[44px] relative size-full">
          <ProgressIndicator />
          <WelcomeSection />
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Sign In">
      <Container />
    </div>
  );
}