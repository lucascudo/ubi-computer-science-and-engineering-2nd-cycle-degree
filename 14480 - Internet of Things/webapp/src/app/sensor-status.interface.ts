export default interface ISensorStatus {
    timestamp: number,
    isOn?: boolean,
    isOpen?: boolean,
    value?: number
}