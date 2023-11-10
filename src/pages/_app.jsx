import '../globals.css';
import '@radix-ui/themes/styles.css';
// import '@radix-ui/react-progress/index.css';

import { Theme, ThemePanel } from '@radix-ui/themes';

// import { Flex, Text, Button } from '@radix-ui/themes';

export default function MyApp({ Component, pageProps }) {
  return (
    <Theme className="m-3" appearance="light" accentColor="iris">
      <Component {...pageProps} />

      {/* <Flex className="w-[30%]" direction="column" gap="2">
        <Text>Hello from Radix Themes :)</Text>
        <Button>Let's go</Button>
      </Flex>

      <ThemePanel /> */}
    </Theme>
  );
}
