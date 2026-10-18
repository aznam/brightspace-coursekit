<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    <xsl:template match="/">
        <button type="button" class="ck-theme-switch" role="switch" aria-checked="false" aria-label="Dark mode">
            <span class="ck-theme-switch__track" aria-hidden="true">
                <span class="ck-theme-switch__thumb"/>
            </span>
        </button>
    </xsl:template>
</xsl:stylesheet>
