/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  const settings = dao.findSettings()
  settings.meta.appName = "Test Application"
  settings.logs.maxDays = 2

  dao.saveSettings(settings)
})
