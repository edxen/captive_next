import { HeadMeta, getCurrentTranslation } from "@/components/utils";
import { StyledHeader } from "@/styles/styled";

const texts = getCurrentTranslation();

const Error = () => {
    return (
        <>
            <HeadMeta page='error' />
            <StyledHeader>
                {texts.error.page_not_exist}
            </StyledHeader>
        </>
    );
};

export default Error;