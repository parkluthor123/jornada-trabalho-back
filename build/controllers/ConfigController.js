"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../configs/prismaClient");
class ConfigController {
    getConfigs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const configs = yield prismaClient_1.prismaClient.config.findMany({
                    include: {
                        DaysWeek: true,
                    },
                });
                return res.json(configs);
            }
            catch (e) {
                return res.status(500).json({ message: e.message });
            }
        });
    }
    createConfig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { workDayIsActive, workDay, days } = req.body;
                const config = yield prismaClient_1.prismaClient.config.create({
                    data: {
                        next_workday: workDay,
                        is_active: workDayIsActive,
                        created_at: new Date(),
                    },
                    select: {
                        id: true,
                    }
                });
                const daysWeek = yield prismaClient_1.prismaClient.$transaction(days.map((day) => {
                    return prismaClient_1.prismaClient.daysWeek.create({
                        data: {
                            day: day.day,
                            initial_date: day.date.initialDate,
                            final_date: day.date.finalDate,
                            Config: {
                                connect: {
                                    id: config.id,
                                }
                            },
                        },
                    });
                }));
                if (!config || !daysWeek) {
                    return res.status(500).json({ message: 'Erro ao criar configuração' });
                }
                else {
                    return res.json({ message: 'Configuração criada com sucesso' });
                }
            }
            catch (e) {
                return res.status(500).json({ message: e.message });
            }
        });
    }
    updateConfig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { workDayIsActive, workDay, days } = req.body;
            try {
                //limpa a tabela de dias da semana
                yield prismaClient_1.prismaClient.daysWeek.deleteMany();
                //salva os dias da semana atualizados
                const daysWeek = yield prismaClient_1.prismaClient.$transaction(days.map((day) => {
                    return prismaClient_1.prismaClient.daysWeek.create({
                        data: {
                            day: day.day,
                            initial_date: day.date.initialDate,
                            final_date: day.date.finalDate,
                            Config: {
                                connect: {
                                    id: 1,
                                }
                            },
                        },
                    });
                }));
                //atualiza as informações da tabela de configurações
                const config = yield prismaClient_1.prismaClient.config.update({
                    where: {
                        id: 1,
                    },
                    data: {
                        next_workday: workDay,
                        is_active: workDayIsActive,
                        created_at: new Date(),
                    },
                });
                if (!config || !daysWeek) {
                    return res.status(500).json({ message: 'Erro ao atualizar configuração' });
                }
                else {
                    return res.json({ message: 'Configuração atualizada com sucesso' });
                }
            }
            catch (e) {
                return res.status(500).json({ message: e.message });
            }
        });
    }
}
exports.default = new ConfigController();
