import request from "@/utils/request";
const basePath = "addons/sd_drviing/core/api.php/?s=";
export function getDriverPosition(data) {
    return request.get(`${basePath}Report_location/getDriverPosition`, data);
}
