interface CommandType {
	cmd: string;
	interpret: (props: { stdout: string; stderr: string; exitCode: number }) => {
		isSuccess: boolean;
		title: string;
		text?: string;
		summary?: string;
		actions?: { label: string; description: string; identifier: string }[];
	};
}
